# Iszolea Packages Publisher
![Intro](/media/intro.gif?raw=true)

## Description

A desktop app which provides publishing the Iszolea packages easily with validation according to the Iszolea team's rules.

## Key features
* Publishing predefined NuGet packages via 'button' with minimum settings;
* Publishing predefined npm packages (coming soon);
* Publishing multi-packages (e.g. the ISOZ.Core - ISOZ.Business set) as a single operation;
* Rejecting published packages;
* Inferring the next package version by current version (without typing anything);
* Validation a custom package version (which can be typed manually if the auto inferring does not suit);
* Creating a marker git-commit with version changes in required project files;
* Creating git tags which reflect a new package version according the Iszolea team's rules;
* The app has auto-update feature. So once installed, it will be always up-to-date;

## Requirements
* OS: Windows
* [Nuget](https://docs.microsoft.com/en-us/nuget/tools/nuget-exe-cli-reference#installing-nugetexe) must be installed and available globally (placed to your PATH environment variable); Check the acceptance of the `nuget` command in CLI;
* [.NET SDK](https://dotnet.microsoft.com/download/visual-studio-sdks) must be installed. Check the acceptance of the `dotnet` command in CLI;
