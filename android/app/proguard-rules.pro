# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


# Keep the entry point of your application (e.g., MainActivity)
-keep class com.yourpackage.MainActivity { *; }

# Keep all classes in a specific package from being obfuscated
-keep class com.yourpackage.mypackage.** { *; }

# Keep specific classes from being obfuscated
-keep class com.yourpackage.MyClass { *; }

# Keep specific methods from being obfuscated
-keepclassmembers class com.yourpackage.MyClass {
    public void myMethod();
}

# Keep specific fields from being obfuscated
-keepclassmembers class com.yourpackage.MyClass {
    public int myField;
}

# Keep classes used for reflection
-keepclassmembers class * {
    java.lang.Class class$(java.lang.String);
    java.lang.Class class$(java.lang.String, boolean);
}

# Keep classes that are accessed via JNI
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep the names of native method arguments and return values
-keepclasseswithmembers class * {
    native <methods>;
}
