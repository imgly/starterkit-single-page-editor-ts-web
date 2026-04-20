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
import { resolveAssetPath } from './imgly/resolveAssetPath';

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
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load a multi-page social media template to demonstrate single-page mode
    // This 4-page Instagram post template showcases page navigation in single-page mode
    // Alternatively, create a blank scene via: await cesdk.actions.run('scene.create');
    await cesdk.loadFromArchiveURL(resolveAssetPath('/assets/ig-post.archive'));
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
