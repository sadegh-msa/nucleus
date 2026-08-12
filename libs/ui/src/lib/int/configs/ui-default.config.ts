import type { UiPopoverModel } from '../../ext/models/popover.model';
import type { ExtentType } from '../../ext/types/extent.type';
import type { UiIconVariant } from '../../ext/types/icon.type';
import type { UiMenuModeType, UiMenuSubModeType } from '../../ext/types/menu.type';
import type { UiPlacementType } from '../../ext/types/placement.type';
import type { TriggerEventType } from '../../ext/types/trigger.type';

export const uiDefaultConfig = Object.freeze({
  formField: {
    helpPlacement: 'block-start-inline-end' as UiPlacementType,
  },
  menu: {
    extent: 'wide' as ExtentType,
    mode: 'still' as UiMenuModeType,
    submenuMode: 'sliding' as UiMenuSubModeType,
    popoverPlacement: 'inline-end-edge-end' as UiPlacementType,
    tooltipPlacement: 'inline-end-block-center' as UiPlacementType,
    item: {
      icon: {
        variant: {
          default: 'outline' as UiIconVariant,
          active: 'bold' as UiIconVariant,
        },
      },
    },
  },
  message: {
    duration: 5000,
  },
  popover: {
    triggerEvent: 'click' as TriggerEventType,
    placement: 'block-start-inline-center' as UiPlacementType,
    attachTo: 'body' as UiPopoverModel['attachTo'],
    hasBubble: true,
    hasArrow: true,
    hasClose: false,
    disabled: false,
    closeDelay: 0,
  },
  ripple: {
    duration: 1000,
    tag: 's',
  },
  svgIcon: {
    loadingStatus: 'loading',
    retryingTimes: 10,
    storageKeyPrefix: 'uiSvgIcon',
    variant: 'outline' as UiIconVariant,
  },
  tooltip: {
    triggerEvent: 'hover' as TriggerEventType,
    placement: 'block-start-inline-center' as UiPlacementType,
    attachTo: 'body' as UiPopoverModel['attachTo'],
    hasBubble: true,
    hasArrow: true,
    disabled: false,
  },
});
