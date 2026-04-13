/**
 * CE.SDK Single Page Editor Starterkit - Main Entry Point
 *
 * A design editor configured for single-page designs like social media posts,
 * business cards, or fixed single-page graphics.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initSinglePageEditor } from './imgly';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-single-page-editor-user',

  // Single-page mode is enabled via featureFlags
  featureFlags: {
    singlePageMode: true
  }

  // Local assets
  // baseURL: `/assets/`,
};

// ============================================================================
// Initialize Single Page Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initSinglePageEditor(cesdk);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
