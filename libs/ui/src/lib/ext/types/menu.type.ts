export const uiMenuModes = ['popup', 'still'] as const;
export type UiMenuModeType = (typeof uiMenuModes)[number];

export const uiMenuSubModes = ['floating', 'sliding'] as const;
export type UiMenuSubModeType = (typeof uiMenuSubModes)[number];
