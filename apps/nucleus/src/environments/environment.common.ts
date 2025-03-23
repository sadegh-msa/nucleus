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
          path: 'logo/manufacturer/logo-no-title.svg',
          height: 30,
          width: 30
        },
        hTitle: {
          path: 'logo/manufacturer/logo-h-title.svg',
          height: 30,
          width: 124
        },
        vTitle: {
          path: 'logo/manufacturer/logo-v-title.svg',
          height: 60,
          width: 96
        }
      }
    },
    organization: {
      title: 'Manufacturer Inc.',
      homePage: '/',
      logo: {
        noTitle: {
          path: 'logo/organization/logo-no-title.svg',
          height: 30,
          width: 30
        },
        hTitle: {
          path: 'logo/organization/logo-h-title.svg',
          height: 30,
          width: 124
        },
        vTitle: {
          path: 'logo/organization/logo-v-title.svg',
          height: 60,
          width: 96
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
