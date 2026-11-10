package com.oscarvelz.tonal

import android.app.Activity
import android.app.AlertDialog
import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageInstaller
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.os.Message
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.webkit.*
import android.widget.FrameLayout
import android.widget.Toast
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * TONAL for Android: a thin shell around the TONAL web app, loaded live from GitHub Pages so every
 * web release arrives on its own (the service worker keeps it working offline after the first open).
 * The WebView storage is its own, separate from Chrome's: saved looks (the Closet) live on this
 * device, in this app.
 *
 * The page may talk to the shell through window.TonalNative (feature-detected; the browser/PWA
 * never see it): version, and bar colours. Nothing in the web app changes when TonalNative is absent.
 */
class MainActivity : Activity() {
    private lateinit var web: WebView
    private lateinit var root: FrameLayout
    private lateinit var frame: FrameLayout
    private lateinit var statusBg: View
    private val home = "https://oscarvelz.github.io/Tonal/"
    private val prefs by lazy { getSharedPreferences("tonal-shell", MODE_PRIVATE) }
    private var topColor = Color.parseColor("#0B0B0C")
    private var bottomColor = Color.parseColor("#0B0B0C")
    private var topDark = true
    private var bottomDark = true
    private var fileCb: ValueCallback<Array<Uri>>? = null
    @Volatile private var trusted = false
    @Volatile private var pageReady = false
    private var lastBack = 0L

    companion object {
        private const val RQ_FILES = 7
        private const val REPO_RELEASES = "https://api.github.com/repos/Oscarvelz/Tonal/releases?per_page=30"
    }

    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        topColor = prefs.getInt("top", topColor); bottomColor = prefs.getInt("bottom", bottomColor)
        topDark = prefs.getBoolean("topDark", true); bottomDark = prefs.getBoolean("bottomDark", true)
        window.setDecorFitsSystemWindows(false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        window.isNavigationBarContrastEnforced = false
        window.isStatusBarContrastEnforced = false

        root = FrameLayout(this)
        frame = FrameLayout(this)
        web = WebView(this)
        statusBg = View(this)
        frame.addView(web, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        root.addView(frame, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))
        root.addView(statusBg, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, Gravity.TOP))
        // The page sits between the system bars like the installed PWA (no content under them); the status bar shows
        // the colour at the top of the page, the navigation bar the colour at its bottom (both sent by the page).
        root.setOnApplyWindowInsetsListener { _, insets ->
            val bars = insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
            val ime = insets.getInsets(WindowInsets.Type.ime())
            frame.setPadding(bars.left, bars.top, bars.right, maxOf(bars.bottom, ime.bottom))
            statusBg.layoutParams = (statusBg.layoutParams as FrameLayout.LayoutParams).apply { height = bars.top }
            WindowInsets.CONSUMED
        }
        setContentView(root)
        applyBars()

        web.settings.apply {
            javaScriptEnabled = true; domStorageEnabled = true; databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = false; allowContentAccess = true
            setSupportMultipleWindows(true); javaScriptCanOpenWindowsAutomatically = true
            userAgentString = "$userAgentString TonalAndroid/${BuildConfig.VERSION_NAME}"
        }
        ServiceWorkerController.getInstance().serviceWorkerWebSettings.apply {
            cacheMode = WebSettings.LOAD_DEFAULT; allowContentAccess = true; allowFileAccess = false
        }
        CookieManager.getInstance().setAcceptCookie(true)
        web.addJavascriptInterface(Bridge(), "TonalNative")
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest): Boolean {
                if (isTonal(r.url)) return false
                openOutside(r.url); return true
            }
            override fun onPageStarted(v: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                trusted = url != null && isTonal(Uri.parse(url)); pageReady = false
            }
            override fun onPageFinished(v: WebView, url: String?) {
                trusted = url != null && isTonal(Uri.parse(url)); pageReady = trusted
            }
            override fun onReceivedError(v: WebView, r: WebResourceRequest, e: WebResourceError) {
                if (!r.isForMainFrame) return
                v.loadDataWithBaseURL(home, "<html><head><meta name=viewport content='width=device-width'></head>" +
                    "<body style=\"background:#0B0B0C;color:#F4F1EA;font:18px sans-serif;padding:32px;line-height:1.5\">" +
                    "<p>TONAL needs the internet the first time it opens; after that it works offline.</p>" +
                    "<p><a style=\"color:#E8E2D6\" href=\"$home\">Try again</a></p></body></html>", "text/html", "utf-8", null)
            }
        }
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(v: WebView, cb: ValueCallback<Array<Uri>>, p: FileChooserParams): Boolean {
                fileCb?.onReceiveValue(null); fileCb = cb
                return try { startActivityForResult(p.createIntent().putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true), RQ_FILES); true }
                catch (e: Exception) { fileCb = null; false }
            }
            // target=_blank / window.open: TONAL pages stay here, everything else opens in the browser or its own app.
            override fun onCreateWindow(v: WebView, dialog: Boolean, gesture: Boolean, msg: Message): Boolean {
                val probe = WebView(this@MainActivity)
                var done = false
                fun take(pv: WebView, u: Uri?): Boolean {
                    if (u == null || u.scheme == "about" || done) return true
                    done = true
                    if (isTonal(u)) web.loadUrl(u.toString()) else openOutside(u)
                    pv.post { pv.stopLoading(); pv.destroy() }
                    return true
                }
                probe.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(pv: WebView, r: WebResourceRequest): Boolean = take(pv, r.url)
                    override fun onPageStarted(pv: WebView, url: String?, favicon: android.graphics.Bitmap?) { take(pv, url?.let { Uri.parse(it) }) }
                }
                (msg.obj as WebView.WebViewTransport).webView = probe
                msg.sendToTarget()
                return true
            }
        }
        web.setDownloadListener { url, _, _, _, _ ->
            if (url.startsWith("http")) openOutside(Uri.parse(url))
        }
        if (state != null) web.restoreState(state) else web.loadUrl(home)
        checkUpdate()
    }

    private fun isTonal(u: Uri): Boolean {
        val s = u.scheme ?: return false
        if (s == "blob" || s == "data" || s == "about") return true
        return s == "https" && u.host == "oscarvelz.github.io" && ((u.path ?: "") == "/Tonal" || (u.path ?: "").startsWith("/Tonal/"))
    }

    private fun openOutside(u: Uri) {
        try {
            val i = if (u.scheme == "intent") Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME).apply { selector = null; component = null }
                    else Intent(Intent.ACTION_VIEW, u)
            startActivity(i.addCategory(Intent.CATEGORY_BROWSABLE))
        } catch (_: Exception) {
            Toast.makeText(this, "No app can open this link.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun applyBars() {
        statusBg.setBackgroundColor(topColor)
        root.setBackgroundColor(bottomColor)
        web.setBackgroundColor(topColor)
        window.decorView.setBackgroundColor(bottomColor)
        val ls = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
        val ln = WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
        window.insetsController?.setSystemBarsAppearance((if (topDark) 0 else ls) or (if (bottomDark) 0 else ln), ls or ln)
    }

    private fun parseColor(s: String): Int? = runCatching {
        val t = s.trim()
        when {
            t.startsWith("#") -> Color.parseColor(t)
            t.startsWith("rgb") -> { val n = Regex("[\\d.]+").findAll(t).map { it.value.toFloat() }.toList(); Color.rgb(n[0].toInt(), n[1].toInt(), n[2].toInt()) }
            else -> null
        }
    }.getOrNull()

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(rq: Int, rc: Int, d: Intent?) {
        if (rq != RQ_FILES) { super.onActivityResult(rq, rc, d); return }
        val cd = d?.clipData
        val res: Array<Uri>? = if (rc != RESULT_OK) null
            else if (cd != null) Array(cd.itemCount) { cd.getItemAt(it).uri }
            else WebChromeClient.FileChooserParams.parseResult(rc, d)
        fileCb?.onReceiveValue(res); fileCb = null
    }

    /* ---------- the bridge ---------- */

    inner class Bridge {
        @JavascriptInterface fun version(): String = BuildConfig.VERSION_NAME

        @JavascriptInterface fun setBars(top: String, bottom: String, darkTop: Boolean, darkBottom: Boolean) {
            if (!trusted) return
            val t = parseColor(top) ?: return
            val b = parseColor(bottom) ?: t
            runOnUiThread {
                topColor = t; bottomColor = b; topDark = darkTop; bottomDark = darkBottom
                prefs.edit().putInt("top", t).putInt("bottom", b).putBoolean("topDark", darkTop).putBoolean("bottomDark", darkBottom).apply()
                applyBars()
            }
        }

        @JavascriptInterface fun atRoot(msg: String) {
            runOnUiThread { leaveOnSecondBack(msg.ifBlank { "Press back again to close TONAL" }) }
        }
    }

    /* ---------- back ---------- */

    private fun leaveOnSecondBack(msg: String) {
        val now = System.currentTimeMillis()
        if (now - lastBack < 2000) finish()
        else { lastBack = now; Toast.makeText(this, msg, Toast.LENGTH_SHORT).show() }
    }

    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (!pageReady) { plainBack(); return }
        // TONAL decides: an open sheet closes; at the first screen the page calls atRoot().
        web.evaluateJavascript("(function(){try{return window.TonalBack?window.TonalBack():'none'}catch(e){return 'none'}})()") { r ->
            if (r == null || r.contains("none")) plainBack()
        }
    }

    private fun plainBack() {
        if (web.canGoBack()) web.goBack() else leaveOnSecondBack("Press back again to close TONAL")
    }

    /* ---------- updates of the app itself ---------- */

    /** If GitHub has a newer android-N release with Tonal.apk, offer it (at most once a day per version) and install in place. */
    private fun checkUpdate() = Thread {
        try {
            val c = URL(REPO_RELEASES).openConnection() as HttpURLConnection
            c.setRequestProperty("Accept", "application/vnd.github+json"); c.connectTimeout = 8000; c.readTimeout = 8000
            val list = JSONArray(c.inputStream.bufferedReader().readText())
            var best = BuildConfig.VERSION_CODE
            var url: String? = null
            for (i in 0 until list.length()) {
                val r = list.getJSONObject(i)
                if (r.optBoolean("draft") || r.optBoolean("prerelease")) continue
                val n = r.getString("tag_name").takeIf { it.startsWith("android-") }?.substringAfter("android-")?.toIntOrNull() ?: continue
                if (n <= best) continue
                val assets = r.getJSONArray("assets")
                val apk = (0 until assets.length()).map { assets.getJSONObject(it) }.firstOrNull { it.getString("name") == "Tonal.apk" } ?: continue
                best = n; url = apk.getString("browser_download_url")
            }
            val found = url ?: return@Thread
            val askedAt = prefs.getLong("asked-$best", 0L)
            if (System.currentTimeMillis() - askedAt < 86_400_000L) return@Thread
            runOnUiThread {
                prefs.edit().putLong("asked-$best", System.currentTimeMillis()).apply()
                AlertDialog.Builder(this).setTitle("New version of TONAL")
                    .setMessage("A new version of the app is ready. Install it now? Your saved looks stay as they are.")
                    .setPositiveButton("Install") { _, _ -> install(found) }.setNegativeButton("Later", null).show()
            }
        } catch (_: Exception) {}
    }.start()

    private fun install(url: String) {
        Toast.makeText(this, "Downloading the update…", Toast.LENGTH_SHORT).show()
        Thread {
            try {
                val pi = packageManager.packageInstaller
                val id = pi.createSession(PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL))
                pi.openSession(id).use { s ->
                    val c = URL(url).openConnection() as HttpURLConnection; c.instanceFollowRedirects = true
                    c.inputStream.use { inp -> s.openWrite("tonal.apk", 0, -1).use { out -> inp.copyTo(out); s.fsync(out) } }
                    val back = Intent(this, MainActivity::class.java).setAction("tonal.INSTALL")
                    val pend = PendingIntent.getActivity(this, 1, back, PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
                    s.commit(pend.intentSender)
                }
            } catch (e: Exception) { runOnUiThread { Toast.makeText(this, "Could not update: ${e.message}", Toast.LENGTH_LONG).show() } }
        }.start()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (intent.action == "tonal.INSTALL") {
            when (intent.getIntExtra(PackageInstaller.EXTRA_STATUS, -999)) {
                PackageInstaller.STATUS_PENDING_USER_ACTION -> {
                    @Suppress("DEPRECATION") val confirm = intent.getParcelableExtra<Intent>(Intent.EXTRA_INTENT)
                    if (confirm != null) startActivity(confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                }
                PackageInstaller.STATUS_SUCCESS -> {}
                else -> Toast.makeText(this, "The update was not installed: " + (intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE) ?: ""), Toast.LENGTH_LONG).show()
            }
            return
        }
    }

    override fun onPause() {
        super.onPause()
        CookieManager.getInstance().flush()
    }

    override fun onSaveInstanceState(out: Bundle) { super.onSaveInstanceState(out); web.saveState(out) }
}
