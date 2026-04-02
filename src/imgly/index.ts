/**
 * CE.SDK Single Page Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the single-page editor.
 * Import and call `initSinglePageEditor()` to configure a CE.SDK instance for
 * single-page design editing (social media posts, business cards, etc.).
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration and plugins
import { SinglePageEditorConfig } from './config/plugin';

// Re-export for external use
export { SinglePageEditorConfig } from './config/plugin';

/**
 * Initialize the CE.SDK Single Page Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Single-page mode enabled (no multi-page navigation)
 * - Design editor UI configuration
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Custom page-select component for navigating multi-page templates
 * - Actions dropdown in navigation bar
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initSinglePageEditor(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the single-page editor configuration plugin
  // This sets up the UI, features, settings (including singlePageModeEnabled),
  // and i18n for single-page design editing
  await cesdk.addPlugin(new SinglePageEditorConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // Configure appearance: 'light' | 'dark' | 'system'
  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');

  // ============================================================================
  // Disable Placeholder and Preview Features
  // ============================================================================

  // Disable placeholder and preview features for single-page mode
  cesdk.feature.set('ly.img.placeholder', () => false);
  cesdk.feature.set('ly.img.preview', () => false);

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Asset source plugins provide built-in asset libraries

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images)
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates, images) - focus on single-page social templates
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.templates.social.*', 'ly.img.image.*']
    })
  );

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Custom Page Navigation Component
  // ============================================================================

  // Add custom icons for page navigation arrows
  cesdk.ui.addIconSet(
    '@imgly/custom',
    `
      <svg>
        <symbol
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="@imgly/custom/icon/ArrowLeft"
        >
        <path d="M4.79289 12.7072L11.2929 19.2072L12.7071 17.793L7.91414 13H19V11H7.9143L12.7071 6.20718L11.2929 4.79297L4.79289 11.293C4.60536 11.4805 4.5 11.7349 4.5 12.0001C4.5 12.2653 4.60536 12.5196 4.79289 12.7072Z" fill="currentColor"/>
        </symbol>
        <symbol
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="@imgly/custom/icon/ArrowRight"
        >
        <path d="M19.2071 12.7072L12.7071 19.2072L11.2929 17.793L16.0858 13.0001H5V11.0001H16.0858L11.2929 6.20719L12.7071 4.79297L19.2071 11.293C19.3947 11.4805 19.5 11.7349 19.5 12.0001C19.5 12.2653 19.3947 12.5196 19.2071 12.7072Z" fill="currentColor"/>
        </symbol>
      </svg>
    `
  );

  // Register custom page-select component for navigating templates with multiple pages
  // This provides a way to switch between pages in multi-page templates while
  // keeping the single-page editing mode experience

  function getPageName(
    engine: CreativeEditorSDK['engine'],
    pageId: number,
    useName = false
  ): string {
    if (!engine.block.isValid(pageId)) return '';
    const allPages = engine.scene.getPages();
    if (!allPages.includes(pageId)) return '';

    return (
      (useName && engine.block.getName(pageId)) ||
      `Page ${allPages.indexOf(pageId) + 1}`
    );
  }

  function switchAndSelectPage(newPage: number) {
    cesdk.unstable_switchPage(newPage);
    // Select the new page
    cesdk.engine.block.select(newPage);
  }

  let lastActivePageIndex = 0;
  cesdk.ui.registerComponent('page-select', ({ builder, engine }) => {
    const pageIds = engine.scene.getPages();
    const activePageId = engine.scene.getCurrentPage();

    // If a user deletes the current page, manually switch to another page
    if (activePageId !== null && !pageIds.includes(activePageId)) {
      const newPage =
        pageIds[lastActivePageIndex] ??
        pageIds[lastActivePageIndex - 1] ??
        pageIds[0];
      if (newPage !== undefined) {
        switchAndSelectPage(newPage);
      }
    }
    if (activePageId !== null) {
      lastActivePageIndex = pageIds.indexOf(activePageId);
    }

    // If there is only one page, don't show the page select component
    if (pageIds.length <= 1) return;

    // If there are less than 4 pages, show all pages as buttons
    if (pageIds.length <= 3) {
      builder.ButtonGroup('pages', {
        children: () => {
          pageIds.forEach((id) => {
            builder.Button(String(id), {
              label: getPageName(engine, id, true),
              isActive: activePageId === id,
              onClick: () => activePageId !== id && switchAndSelectPage(id)
            });
          });
        }
      });
    } else {
      // If there are more than 3 pages, show prev/next buttons with dropdown
      const activePageIndex =
        activePageId !== null ? pageIds.indexOf(activePageId) : 0;
      const prevPageId = pageIds[activePageIndex - 1];
      const nextPageId = pageIds[activePageIndex + 1];

      builder.ButtonGroup('pagesControls', {
        children: () => {
          builder.Button('prevPage', {
            tooltip: 'Previous Page',
            icon: '@imgly/custom/icon/ArrowLeft',
            isDisabled: prevPageId === undefined,
            onClick: () =>
              prevPageId !== undefined && switchAndSelectPage(prevPageId)
          });

          builder.Dropdown('pageSelect', {
            tooltip: 'Select Page',
            label: `${activePageId !== null ? getPageName(engine, activePageId) : ''} / ${pageIds.length}`,
            children: ({ close }) => {
              pageIds.forEach((id) => {
                builder.Button(String(id), {
                  label: engine.block.getName(id) || getPageName(engine, id),
                  isActive: activePageId === id,
                  onClick: () => {
                    switchAndSelectPage(id);
                    close();
                  }
                });
              });
            }
          });

          builder.Button('nextPage', {
            tooltip: 'Next Page',
            icon: '@imgly/custom/icon/ArrowRight',
            isDisabled: nextPageId === undefined,
            onClick: () =>
              nextPageId !== undefined && switchAndSelectPage(nextPageId)
          });
        }
      });
    }
  });

  // Configure canvas bar with custom page-select component
  cesdk.ui.setCanvasBarOrder(
    [
      { id: 'ly.img.settings.canvasBar' },
      { id: 'ly.img.spacer' },
      // Add the page select component for multi-page template navigation
      { id: 'page-select' },
      { id: 'ly.img.page.add.canvasBar' },
      { id: 'ly.img.spacer' }
    ],
    'bottom'
  );

  // ============================================================================
  // Navigation Bar Actions
  // ============================================================================

  // Configure the actions dropdown in the navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    }
  );

  // ============================================================================
  // Scene Loading
  // ============================================================================

  // Load a multi-page social media template to demonstrate single-page mode
  // This 4-page Instagram post template showcases page navigation in single-page mode
  // Alternatively, create a blank scene via: await cesdk.actions.run('scene.create');
  await cesdk.loadFromArchiveURL(
    'https://img.ly/showcases/cesdk/cases/single-page-mode/ig-post.archive'
  );
}
