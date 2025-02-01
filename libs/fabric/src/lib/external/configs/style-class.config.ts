type Color = 'basic' | 'danger' | 'info' | 'primary' | 'success' | 'warning'
type ButtonStyleClass = {
  [c in `button-${Color}` | `button-${Color}-text` | `button-${Color}-text-hover`]: string[]
}

const common = ['fab-component'];
const buttonCommon = ['fab-button'];
const inputCommon = ['fab-input', 'fab-input-box'];
const colors: Color[] = ['basic', 'danger', 'info', 'primary', 'success', 'warning'];
const buttonStyleClass = {} as ButtonStyleClass;

for (const color of colors) {
  buttonStyleClass[`button-${color}`] = ['fab-button-filled', `fab-button-${color}`];
  buttonStyleClass[`button-${color}-text`] = ['fab-button-text', `fab-button-${color}`];
  buttonStyleClass[`button-${color}-text-hover`] = ['fab-button-text-hover', `fab-button-${color}`];
}

export const baseStyleClass = {
  ...buttonStyleClass,

  'input-text': ['fab-input-text'],
  'input-password': ['fab-input-password'],

  'checkbox': ['fab-checkbox'],
  'toggle': ['fab-toggle'],

  'bubble': ['fab-bubble'],
  'card': ['fab-card'],
  'form-field': ['fab-form-field']
};


export const componentStyleClass = new Proxy(baseStyleClass, {
  get(target: typeof baseStyleClass, prop: keyof typeof baseStyleClass) {
    return [
      ...common,
      ...(prop.startsWith('button-') ? buttonCommon : []),
      ...(prop.startsWith('input-') ? inputCommon : []),
      ...target[prop]
    ];
  }
});
