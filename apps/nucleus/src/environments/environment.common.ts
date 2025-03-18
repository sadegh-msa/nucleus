export const environment = {
  rest: {
    url: 'https://mockoon.localhost:3000/api'
  },
  auth: {
    rememberMeExpiry: 30 * 24 * 60,
  },
  branding: {
    manufacturer: {
      title: 'Manufacturer Inc.',
      homePage: 'https://example.com',
      logo: {
        noTitle: {
          path: 'assets/core/images/manufacturer/logo-no-title.svg',
          height: 30,
          width: 30
        },
        hTitle: {
          path: 'assets/core/images/manufacturer/logo-h-title.svg',
          height: 30,
          width: 124
        },
        vTitle: {
          path: 'assets/core/images/manufacturer/logo-v-title.svg',
          height: 60,
          width: 96
        }
      }
    },
    organization: {
      title: 'Manufacturer Inc.',
      homePage: 'https://example.com',
      logo: {
        noTitle: {
          path: 'assets/core/images/organization/logo-no-title.svg',
          height: 34,
          width: 34
        },
        hTitle: {
          path: 'assets/core/images/organization/logo-h-title.svg',
          height: 34,
          width: 140
        },
        vTitle: {
          path: 'assets/core/images/organization/logo-v-title.svg',
          height: 80,
          width: 126
        }
      }
    }
  },
  ui: {
    icon: {
      svg: {
        dir: 'svg'
      }
    }
  }
};
