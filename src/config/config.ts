import { AppConfig } from './appConfig';

export const config: AppConfig = {
  links: {
    help: 'https://github.com/maxima-net/iszolea-packages-publisher/wiki/How-to-publish',
    requirements: 'https://github.com/maxima-net/iszolea-packages-publisher#requirements'
  },
  texts: {
    confirmUnPublishingText: 'Are you sure you want to revert the changes in the files and unpublish the package(s)?'
  },
  nuget: {
    solutions: {
      isozBase: {
        displayedName: 'Isoz Base',
        slnFileName: 'ISOZ.sln',
        packages: {
          eventRegistrationSystemContracts: { projectNames: ['EventRegistrationSystem.Contracts'] },
          isozBusinessAndCore: { projectNames: ['ISOZ.Business', 'ISOZ.Core'] },
          isozClaims: { projectNames: ['ISOZ.Claims'] },
          isozLicence: { projectNames: ['ISOZ.Licence'] },
          isozMessaging: { projectNames: ['ISOZ.Messaging'] },
          isozRabbitMQClient: { projectNames: ['ISOZ.RabbitMQClient'] },
          isozServiceHandler: { projectNames: ['ISOZ.UpdatableService/ISOZ.ServiceHandler'] },
          isozServiceHandlerContracts: { projectNames: ['ISOZ.UpdatableService/ISOZ.ServiceHandler.Contracts'] },
          isozSyncServiceCommon: { projectNames: ['ISOZ.SyncServiceCommon'] },
        }
      },
      smp: {
        displayedName: 'SMP',
        slnFileName: 'SMP.sln',
        packages: {
          isozShopify: { projectNames: ['ISOZ.Shopify'] },
          isozDataNode: { projectNames: ['ISOZ.DataNode'] },
          isozFacebook: { projectNames: ['ExternalProviders/Facebook/ISOZ.Facebook'] },
          isozSmpCommon: { projectNames: ['ISOZ.SMP.Common'] },
          passportControlServiceContracts: { projectNames: ['PassportControlService.Contracts'] },
          syncConductorContracts: { projectNames: ['SyncConductor.Contracts'] }
        }
      },
      bomCommon: {
        displayedName: 'Bom Common',
        slnFileName: 'BomCommon.sln',
        packages: {
          bomCommon: { projectNames: ['BomCommon'] }
        }
      },
      space3Common: {
        displayedName: 'Space3',
        slnFileName: 'Space3.sln',
        packages: {
          space3Common: { projectNames: ['Space3.Common'] }
        }
      },
      reportsPortal: {
        displayedName: 'Reports Portal',
        slnFileName: 'ReportsPortal.sln',
        packages: {
          reportsPortalServiceContracts: { projectNames: ['ReportsPortalService.Contracts'] },
          reportsPortalBase: { projectNames: ['ReportsPortal.Base/ReportsPortal.Base'] }
        }
      }
    }
  },
  npm: {
    packages: {
      iszoleaUi: {
        packageName: 'iszolea-ui',
      }
    }
  }
}; 
