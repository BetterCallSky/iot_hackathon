/**
 * Update this setting for local development only.
 */

if (!process.env.VCAP_SERVICES) {
  process.env.VCAP_SERVICES = JSON.stringify({
    'user-provided': [
      {
        name: 'Push Notifications-37',
        instance_name: 'Push Notifications-37',
        binding_name: null,
        credentials: {
          admin_url:
            'https://mobile.eu-gb.bluemix.net/imfpushdashboard/?appGuid=09df8e33-cc5c-4793-b235-7a39a00787eb',
          apikey: 'sK4moU_0BCLjDp9Ro39F9iPHGm8iYrt1T5AIPuQ3fy0m',
          appGuid: '09df8e33-cc5c-4793-b235-7a39a00787eb',
          clientSecret: '1b368d68-8718-4b4e-97c8-24f624492100',
          iam_apikey_description:
            'Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:imfpush:eu-gb:a/ef09d7824f1a3f40a91e86063084777e:09df8e33-cc5c-4793-b235-7a39a00787eb::',
          iam_apikey_name:
            'auto-generated-apikey-93fe9dff-2c4d-43a5-a49b-804ff41ea607',
          iam_role_crn: 'crn:v1:bluemix:public:iam::::serviceRole:Manager',
          iam_serviceid_crn:
            'crn:v1:bluemix:public:iam-identity::a/ef09d7824f1a3f40a91e86063084777e::serviceid:ServiceId-87db74ed-83b0-4e9d-9e43-681cb58b9de6',
          plan: 'LITE',
          url:
            'https://imfpush.eu-gb.bluemix.net/imfpush/v1/apps/09df8e33-cc5c-4793-b235-7a39a00787eb',
        },
        syslog_drain_url: '',
        volume_mounts: [],
        label: 'user-provided',
        tags: [],
      },
    ],
    'compose-for-mongodb': [
      {
        name: 'disaster-api-mongodb-1537553577737',
        instance_name: 'disaster-api-mongodb-1537553577737',
        binding_name: null,
        credentials: {
          db_type: 'mongodb',
          maps: [],
          instance_administration_api: {
            instance_id: '36bbdab0-1909-40b9-a62e-bf0b65e8f34e',
            root:
              'https://composebroker-dashboard-public.eu-gb.mybluemix.net/api',
            deployment_id: '5ba534ad8807bd001853aa72',
          },
          name: 'bmix-lon-yp-36bbdab0-1909-40b9-a62e-bf0b65e8f34e',
          uri_cli:
            'mongo --ssl --sslAllowInvalidCertificates portal-ssl364-14.bmix-lon-yp-36bbdab0-1909-40b9-a62e-bf0b65e8f34e.1789910136.composedb.com:29462/compose -u admin -p XKGTPRWVUOZFYMJO --authenticationDatabase admin',
          deployment_id: '5ba534ad8807bd001853aa72',
          uri:
            'mongodb://admin:XKGTPRWVUOZFYMJO@portal-ssl364-14.bmix-lon-yp-36bbdab0-1909-40b9-a62e-bf0b65e8f34e.1789910136.composedb.com:29462,sl-eu-lon-2-portal.12.dblayer.com:29462/compose?authSource=admin&ssl=true',
        },
        syslog_drain_url: null,
        volume_mounts: [],
        label: 'compose-for-mongodb',
        provider: null,
        plan: 'Standard',
        tags: [
          'database',
          'big_data',
          'data_management',
          'ibm_created',
          'ibm_dedicated_public',
          'eu_access',
        ],
      },
    ],
  });
}
