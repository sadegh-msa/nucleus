export function getCloseSvg() {
  return `<svg
    class="ui icon linear" width="24" height="24"
    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 3.150239,3.150239 20.849761,20.849761" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 20.99993,3.0000696 3.0000696,20.99993" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
}

export function getCheckmarkSvg() {
  const randomNumber = Math.random().toString().substring(2);

  return `<svg
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="oklch(94% 0.015 250deg)" stroke-width="4"
      stroke-linecap="round" stroke-linejoin="round" class="a${randomNumber}">
      <style>
        %23check-first-${randomNumber}, %23check-second-${randomNumber} {
          height: 0;
          animation-timing-function: ease-in-out;
          animation-duration: 150ms;
          animation-direction: normal;
          animation-fill-mode: both;
        }
        %23check-first-${randomNumber} {
          transform: rotate(-45deg);
          animation-name: firstAnimation;
        }
        %23check-second-${randomNumber} {
          transform: rotate(-135deg);
          animation-name: secondAnimation;
          animation-delay: 150ms;
        }

        @keyframes firstAnimation {
          0% { height: 0; }
          100% { height: 34%; }
        }
        @keyframes secondAnimation {
          0% { height: 0; }
          100% { height: 67%; }
        }
      </style>
      <rect x="-29%" y="40%" width="1%" height="34%" id="check-first-${randomNumber}" />
      <rect x="-80%" y="-27%" width="1%" height="67%" id="check-second-${randomNumber}" />
    </svg>
   `
    .replaceAll('\n', ' ')
    .replaceAll(/\s+/g, ' ');
}
