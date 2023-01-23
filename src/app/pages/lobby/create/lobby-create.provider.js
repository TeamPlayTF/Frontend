/* @flow */
require('./step-restrictions.html');
require('./step-server.html');
require('./step-mumble.html');
require('./step-saved.html');
require('./header.html');
require('./lobby-create-steps.html');
require('./step-map.html');
require('./lobby-create.html');
require('./step-whitelist.html');
require('./step-format.html');
require('./step-league.html');

angular
  .module('tf2stadium')
  .config(LobbyCreateConfig);

angular
  .module('tf2stadium.services')
  .provider('LobbyCreate', LobbyCreate);

const requireAsset = require.context('../../../../assets/img/maps/', true, /\.jpg$/);

/** @ngInject */
function LobbyCreateConfig($stateProvider, LobbyCreateProvider) {
  /*
   Since the steps might change over time, it's much easier
   to add the nested states here with a loop instead of
   manually in app.route.js

   It also makes sense to add them in this separate file
   because they're nested states
   */
  LobbyCreateProvider.wizardSteps = [
    {name: 'saved',             groupKey: 'saved',
     header: 'Load Config'},
    {name: 'format',            groupKey: 'formats'},
    {name: 'map',               groupKey: 'maps'},
    {name: 'league',            groupKey: 'leagues'},
    {name: 'whitelist',         groupKey: 'whitelists'},
    {name: 'mumble',            groupKey: 'mumble'},
    {name: 'restrictions',      groupKey: 'restrictions'},
    {name: 'server',            groupKey: 'server'},
  ];

  for (var i = 0; i < LobbyCreateProvider.wizardSteps.length; i++) {
    var stepName = LobbyCreateProvider.wizardSteps[i].name;
    $stateProvider.state(stepName, {
      url: '/' + stepName,
      parent: 'lobby-create',
      views: {
        'wizard-step': {
          templateUrl: 'app/pages/lobby/create/step-' + stepName + '.html',
        },
      },
    });
  }
}

/** @ngInject */
function LobbyCreate() {

  var lobbyCreateProvider = {};

  lobbyCreateProvider.wizardSteps = {};

  /** @ngInject */
  var lobbyCreateService = function (Websocket, $state, $rootScope,
                                     $filter) {
    const maps = [
      {
        value: 'cp_badlands',
        '6s': true,
      },{
        value: 'cp_reckoner_rc6',
        '6s': true,
      },{
        value: 'cp_granary_pro_rc8',
        '6s': true,
      },{
        value: 'cp_process_f11',
        important: true,
        '6s': true,
        highlander: true,
      },{
        value: 'cp_snakewater_final1',
        '6s': true,
        important: true,
      },{
        value: 'cp_gullywash_f9',
        '6s': true,
        highlander: true,
      },{
        value: 'cp_metalworks_f4',
        '6s': true,
        highlander: true,
      },{
        value: 'cp_warmfront',
        '6s': true,
        highlander: true,
      },{
        value: 'cp_vanguard',
        '6s': true,
        'prolander': true,
        highlander: true,
      },{
        value: 'cp_sunshine',
        '6s': true,
        highlander: true,
      },{
        value: 'koth_product_final',
        '6s': true,
        '4v4': true,
        'prolander': true,
        highlander: true,
        important: true,
      },{
        value: 'koth_proplant_v8',
        highlander: true,
      },{
        value: 'koth_proot_b4b',
        highlander: true,
      },{
        value: 'koth_ashville_final',
        '6s': true,
        highlander: true,
        prolander: true,
      },{
        value: 'pl_upward_f10',
        'prolander': true,
        important: true,
        highlander: true,
      },{
        value: 'pl_badwater_pro_129',
        'prolander': true,
        important: true,
        highlander: true,
      },{
        value: 'pl_borneo',
        'prolander': true,
        highlander: true,
      },{
        value: 'pl_swiftwater_final1',
        'prolander': true,
        highlander: true,
      },{
        value: 'pl_millstone_ugc_7',
        'prolander': true,
        highlander: true,
      },{
        value: 'pl_barnblitz_pro6',
        'prolander': true,
        highlander: true,
      },{
        value: 'pl_vigil_rc9',
        highlander: true,
        prolander: true,
      },{
        value: 'cp_steel_f12',
        highlander: true,
        prolander: true,
        important: true,
      },{
        value: 'koth_lakeside_final',
        'prolander': true,
        highlander: true,
      },{
        value: 'koth_ramjam_rc1',
        'prolander': true,
        highlander: true,
      },{
        value: 'koth_bagel_rc5',
        '6s': true,
        '4v4': true,
      },{
        value: 'koth_clearcut_b15d',
        '6s': true,
        '4v4': true,
      },{
        value: 'koth_maple_ridge_rc2',
        '4v4': true,
      },{
        value: 'koth_undergrove_rc1',
        '4v4': true,
      },{
        value: 'koth_badlands',
        'prolander': true,
        '4v4': true,
      },{
        value: 'koth_highpass',
        'prolander': true,
        '4v4': true,
      },{
        value: 'cp_alamo',
        '4v4': true,
      },{
        value: 'koth_sandstone_pro_rc1',
        'prolander': true,
        '4v4': true,
      },{
        value: 'cp_warmfrost_rc1',
        '4v4': true,
      },{
        value: 'koth_brazil',
        '4v4': true,
      },{
        value: 'koth_artefact_v1',
        '4v4': true,
      },{
        value: 'koth_airfield_b7',
        'prolander': true,
        '4v4': true,
      },{
        value: 'ctf_ballin_sky',
        important: true,
        'bball': true,
      },{
        value: 'ctf_bball_alpine_b4',
        important: true,
        'bball': true,
      },{
        value: 'ultiduo_baloo',
        important: true,
        'ultiduo': true,
      },{
        value: 'koth_ultiduo_r_b7',
        important: true,
        'ultiduo': true,
      },{
        value: 'ultiduo_obsidian_a10',
        'ultiduo': true,
      },
      {
        value: 'ultiduo_spytech_rc1',
        'ultiduo': true,
      },
      {
        value: 'ultiduo_grove_b4',
        'ultiduo': true,
      },
      {
        value: 'ultiduo_baloo_v2',
        'ultiduo': true,
      },
      {
        value: 'ultiduo_lookout_b1',
        'ultiduo': true,
      },
      {
        value: 'ultiduo_champions_legacy_a7',
        'ultiduo': true,
      },
      {
        value: 'ultiduo_gullywash_b2',
        'ultiduo': true,
      },
    ];

    const known = new Set(requireAsset.keys());
    for (const m of maps) {
      let url = `./lobby-create/${m.value}.jpg`;
      if (!known.has(url)) {
        url = url.replace(/_(final|f|rc|beta)\d*\.jpg$/, '.jpg');
      }
      if (known.has(url)) {
        m.image = requireAsset(url);
      }
    }

    var lobbySettingsList = {
      saved: { key: 'saved' },
      formats: {
        key: 'type',
        title: 'Format',
        filterable: true,
        options: [
          {
            value: '6s',
            title: '6s',
            important: true,
            image: require('../../../../assets/img/formats/6s.jpg'),
          },{
            value: 'highlander',
            title: 'Highlander',
            important: true,
            image: require('../../../../assets/img/formats/highlander.jpg'),
          },{
            value: '4v4',
            title: '4v4',
            image: require('../../../../assets/img/formats/4v4.jpg'),
          },{
            value: 'ultiduo',
            title: 'Ultiduo',
            image: require('../../../../assets/img/formats/ultiduo.jpg'),
          },{
            value: 'bball',
            title: 'Bball',
            image: require('../../../../assets/img/formats/bball.jpg'),
          },{
            value: 'debug',
            title: 'Debug',
            image: require('../../../../assets/img/formats/6s.jpg'),
          },{
            value: 'prolander',
            title: 'Prolander',
            image: require('../../../../assets/img/formats/prolander.jpg'),
          },
        ],
      },
      maps: {
        key: 'map',
        title: 'Map',
        filterable: true,
        allowCustomInput: true,
        searchLabel: 'Enter map name',
        options: maps,
        dependsOn: [
          'formats',
        ],
      },
      leagues: {
        key: 'league',
        title: 'League',
        filterable: true,
        options: [
          {
            value: 'etf2l',
            title: 'ETF2L',
            description: '',
            '6s': true,
            highlander: true,
            bball: true,
            ultiduo: true,
          },{
            value: 'ugc',
            title: 'UGC',
            description: '',
            '6s': true,
            highlander: true,
            '4v4': true,
          },{
            value: 'esea',
            title: 'ESEA',
            description: '',
            '6s': true,
          },{
            value: 'ozfortress',
            title: 'ozfortress',
            description: '',
            '6s': true,
          },{
            value: 'asiafortress',
            title: 'AsiaFortress',
            description: '',
            '6s': true,
          },{
            value: 'bballtf',
            title: 'bball.tf',
            description: '',
            bball: true,
          },{
            value: 'rgl',
            title: 'RGL.gg',
            description: '',
            '6s': true,
            'prolander': true,
            highlander: true,
          },
        ],
        dependsOn: [ 'formats' ],
      },
      whitelists: {
        key: 'whitelistID',
        title: 'Whitelist',
        filterable: true,
        allowCustomInput: true,
        searchLabel: 'Enter whitelist.tf ID',
        options: [
          {
            value: 'competitive_6v6',
            title: 'Global Whitelist 6v6',
            etf2l: true,
            rgl: true,
            ugc: true,
            ozfortress: true,
            tfcl: true,
            '6s': true,
          },{
            value: 'ETF2L_9v9',
            title: 'ETF2L Highlander',
            etf2l: true,
            highlander: true,
          },{
            value: 'RGL_9v9',
            title: 'RGL Highlander',
            rgl: true,
            highlander: true,
          },{
            value: 'ETF2L_6v6',
            title: 'ETF2L 6v6',
            etf2l: true,
            '6s': true,
          },{
            value: 'UGC_9v9',
            title: 'UGC Highlander',
            ugc: true,
            highlander: true,
          },{
            value: 'UGC_6v6',
            title: 'UGC 6v6',
            ugc: true,
            '6s': true,
          },{
            value: 'RGL_6v6',
            title: 'RGL 6v6',
            rgl: true,
            '6s': true,
          },{
            value: 'UGC_4v4',
            title: 'UGC 4v4',
            ugc: true,
            '4v4': true,
          },{
            value: 'ESEA_6v6',
            title: 'ESEA 6v6',
            esea: true,
            '6s': true,
          },{
            value: 'ozfortress_6v6',
            title: 'ozfortress 6v6',
            ozfortress: true,
            '6s': true,
          },{
            value: 'AsiaFortress_6v6',
            title: 'AsiaFortress 6v6',
            asia: true,
            '6s': true,
          },{
            value: 'ETF2L_ultiduo',
            title: 'ETF2L Ultiduo',
            etf2l: true,
            ultiduo: true,
          },{
            value: 'ETF2L_bball',
            title: 'ETF2L BBall',
            etf2l: true,
            bball: true,
          },{
            value: 'bballtf',
            title: 'bball.tf',
            bball: true,
            bballtf: true,
          },{
            value: '9685',
            title: 'RGL Prolander (Season 6)',
            rgl: true,
            'prolander': true,
          },
        ],
        dependsOn: [
          'formats',
          'leagues',
        ],
      },
      mumble: {
        key: 'mumbleRequired',
        title: 'Mumble required',
        options: [
          {
            value: true,
            title: 'Mumble required',
            image: require('../../../../assets/img/mumble.svg'),
            description: 'All participants will need to join Mumble channels',
          },{
            value: false,
            title: 'Mumble not required',
            image: require('../../../../assets/img/not-mumble.svg'),
            description: 'Participants will join Mumble only if they want to',
          },{
            value: 'discord',
            title: 'Discord',
            image: require('../../../../assets/img/logos/discord-logo-blurple.svg'),
            description: 'Participants will join Discord channels',
          },
        ],
      },
      restrictions: {
        key: 'restrictionsSet',
      },
    };

    lobbyCreateService.settings = {
      requirements: {
        general: {
          hours: 0,
          lobbies: 0,
        },
      },
      discord: {
        redChannel: '',
        bluChannel: '',
      },
      league: '',
      whitelistID: '',
      map: '',
      server: '',
      rconpwd: '',
    };

    var deleteSetting = function (key) {
      delete lobbyCreateService.settings[key];
      $rootScope.$emit('lobby-create-settings-updated');
    };

    /*
     Receives a field (e.g. lobbySettingsList.maps) and an option value
     (e.g. 'pl_upward'), finds the option in the field and checks
     if it's valid
     */
    var isSettingValid = function (fieldKey, optionValue) {
      var field = lobbySettingsList[fieldKey];
      var optionFilter = $filter('LobbyCreateOptionFilter');

      return field.allowCustomInput ||
        field.options.filter(function (option) {
          return option.value === optionValue &&
            optionFilter([option], fieldKey,'')[0];
        });
    };

    lobbyCreateService.subscribe = function (request, scope, callback) {
      var handler = $rootScope.$on(request, callback);
      scope.$on('$destroy', handler);
    };

    lobbyCreateService.create = function (lobbySettings, callback) {
      callback = callback || angular.noop;

      if (angular.isUndefined(lobbySettings.serverType)) {
        lobbySettings.serverType = 'server';
      }

      Websocket.emitJSON('lobbyCreate',
                         lobbySettings,
                         function (response) {
                           if (response.success) {
                             $state.go('lobby-page', {lobbyID: response.data.id});
                           }
                           callback(response);
                         }
                        );
    };

    lobbyCreateService.verifyServer = function (callback) {
      callback = callback || angular.noop;

      Websocket.emitJSON('serverVerify', {
        server: lobbyCreateService.settings.server,
        rconpwd: lobbyCreateService.settings.rconpwd,
        map: lobbyCreateService.settings.map,
      }, function (response) {
        callback(response);
      });
    };

    lobbyCreateService.getStoredServers = function () {
      return Websocket.emitJSON('getStoredServers');
    };

    lobbyCreateService.getServemeServers = function () {
      return Websocket.emitJSON('getServemeServers');
    };

    lobbyCreateService.getSettingsList = function () {
      return lobbySettingsList;
    };

    lobbyCreateService.getSteps = function () {
      return lobbyCreateProvider.wizardSteps;
    };

    lobbyCreateService.clearLobbySettings = function () {
      lobbyCreateService.settings = {};
      $rootScope.$emit('lobby-create-settings-updated');
    };

    lobbyCreateService.getLobbySettings = function () {
      return lobbyCreateService.settings;
    };

    lobbyCreateService.set = function (key, value) {
      lobbyCreateService.settings[key] = value;
      $rootScope.$emit('lobby-create-settings-updated');

      // If we select something, we need to check if the next steps
      // have already been selected, and if they have, check that they're valid
      var checks = [
        {fieldKey: 'maps', optionName: lobbyCreateService.settings.map},
        {fieldKey: 'leagues', optionName: lobbyCreateService.settings.league},
        {fieldKey: 'whitelists', optionName: lobbyCreateService.settings.whitelistID},
      ];

      checks.forEach(function (check) {
        if (!isSettingValid(check.fieldKey, check.optionName)) {
          var field = lobbySettingsList[check.fieldKey];
          deleteSetting(field.key);
        }
      });
    };

    return lobbyCreateService;
  };

  lobbyCreateProvider.$get = lobbyCreateService;

  return lobbyCreateProvider;
}
