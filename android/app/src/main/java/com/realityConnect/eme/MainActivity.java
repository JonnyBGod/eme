package com.realityConnect.eme;

import android.app.Activity;
import com.github.jonnybgod.RNEventSource.RNEventSourcePackage;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.oney.gcm.GcmPackage;
import io.neson.react.notification.NotificationPackage;
import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.*;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import me.nucleartux.date.ReactDatePackage;

import android.support.v4.app.FragmentActivity;

// HockeyApp
import net.hockeyapp.android.CrashManager;
import net.hockeyapp.android.UpdateManager;
import net.hockeyapp.android.Tracking;

public class MainActivity extends FragmentActivity implements DefaultHardwareBackBtnHandler {
    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new RNEventSourcePackage())

                .addPackage(new GcmPackage())
                .addPackage(new NotificationPackage(this))
                .addPackage(new ReactNativeMapboxGLPackage())
                .addPackage(new ReactMaterialKitPackage())
                .addPackage(new VectorIconsPackage())
                .addPackage(new RNDeviceInfo())
                .addPackage(new ReactNativeLocalizationPackage())
                .addPackage(new ReactDatePackage(this))

                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "McRides", null);

        setContentView(mReactRootView);

        // HockeyApp
        checkForUpdates();
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }

        // HockeyApp
        Tracking.stopUsage(this);
        UpdateManager.unregister();
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }

        // HockeyApp
        Tracking.startUsage(this);
        checkForCrashes();
    }

    // HockeyApp
    private void checkForCrashes() {
        CrashManager.register(this, "1888ef4e6b7a4b3eb77e382a6cc311bd");
    }
    // HockeyApp
    private void checkForUpdates() {
        // Remove this for store / production builds!
        UpdateManager.register(this, "1888ef4e6b7a4b3eb77e382a6cc311bd");
    }
}
