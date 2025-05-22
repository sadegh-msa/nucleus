export const environment = {
  production: false,
  version: '1.0.0',
  api: {
    rest: {
      url: 'https://mockoon.localhost:3000/api',
      path: 'api/v1',
      time: '',
    },
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
          width: 30,
        },
        hTitle: {
          path: 'logo/manufacturer/logo-h-title.svg',
          height: 30,
          width: 124,
        },
        vTitle: {
          path: 'logo/manufacturer/logo-v-title.svg',
          height: 60,
          width: 96,
        },
      },
    },
    organization: {
      title: 'Organization Inc.',
      homePage: '/',
      logo: {
        noTitle: {
          path: 'logo/organization/logo-no-title.svg',
          height: 30,
          width: 30,
        },
        hTitle: {
          path: 'logo/organization/logo-h-title.svg',
          height: 30,
          width: 124,
        },
        vTitle: {
          path: 'logo/organization/logo-v-title.svg',
          height: 60,
          width: 96,
        },
      },
    },
  },
  crypto: {
    algorithm: {
      name: 'AES-CTR',
      length: 128,
    },
    secureKey: 'RnZhS1OkJsgwq72xAp854NcdC1GvmIvI', // length === 32
  },
  languages: {
    'en-US': 'English - US',
    fa: 'فارسی',
  },
  links: {
    customerAgreement: 'https://example.com/terms-and-conditions',
    privacyPolicy: 'https://example.com/privacy',
  },
  ui: {
    icon: {
      dir: 'icons',
    },
    message: {
      duration: 5000,
    },
    verification: {
      duration: 2 * 60,
      length: 6,
    },
  },
};
