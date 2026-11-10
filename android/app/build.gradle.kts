plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}
// versionCode = android/version.txt locally, the GitHub Actions run number in CI (release tag android-N).
val code = (System.getenv("VERSION_CODE") ?: "1").toInt()
// The signing key never lives in this public repo. CI signs only when the TONAL_KS_B64 / TONAL_KS_PASS secrets exist
// (decoded to a temp file, path in TONAL_KS_FILE); otherwise it builds an unsigned APK that is signed privately.
val ksFile = System.getenv("TONAL_KS_FILE")
val ksPass = System.getenv("TONAL_KS_PASS")
android {
    namespace = "com.oscarvelz.tonal"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.oscarvelz.tonal"
        minSdk = 30
        targetSdk = 34
        versionCode = code
        versionName = "1.0.$code"
    }
    if (!ksFile.isNullOrBlank() && !ksPass.isNullOrBlank()) {
        signingConfigs {
            create("rel") {
                storeFile = file(ksFile)
                storePassword = ksPass
                keyAlias = "tonal"
                keyPassword = ksPass
                storeType = "pkcs12"
            }
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            if (!ksFile.isNullOrBlank() && !ksPass.isNullOrBlank()) signingConfig = signingConfigs.getByName("rel")
        }
    }
    buildFeatures { buildConfig = true }
    lint { checkReleaseBuilds = false; abortOnError = false }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
