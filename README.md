# Iszolea Packages Publisher
<img alt="Intro" src="/media/intro.gif?raw=true">

## Description

A desktop app which provides publishing the Iszolea packages easily with validation according to the Iszolea team's rules.

## Key features
* Publishing predefined NuGet packages via 'button' with minimum settings;
* Publishing predefined npm packages (coming soon);
* Publishing multi-packages (Core, Business) as single operation;
* Rejecting published packages;
* Inferring the next package version by current version (without typing);
* Validation a custom package version (which can be typed manually if auto inferring does not suit in your case);
* Creating a marker git-commit with version changes in required csproj files;
* Creating git tags which reflect a new package version(s) according to the rules;
* The app has auto-update feature. So once installed, it would be always up-to-date;

## Requirements
* System: Windows
* [Nuget](https://docs.microsoft.com/en-us/nuget/tools/nuget-exe-cli-reference#installing-nugetexe) must be installed and available globally (placed to your PATH environment variable); Check the acceptance of the `nuget` command in CLI;
* [.NET SDK](https://dotnet.microsoft.com/download/visual-studio-sdks) must be installed. Check the acceptance of the `dotnet` command in CLI;
