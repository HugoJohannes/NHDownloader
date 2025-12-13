# Changelog

## [0.1.0] - 2025-12-12

### Added

- Basic doujinshi downloads
- ZIP packaging for doujin downloads
- Automatic file naming according to doujin title
- Get doujin's ID from the page and provide an option to append it to the final file name
- Download progress tracking that retains its state even when popup is closed

### Known Issues

- Extension crashes on _any one of_ image download error
- Download state management crashes on any possible errors on the service worker which leads to the download UI getting stuck unless the user manually reset the extension's storage  
  Other situations that may cause state crash:
  - Any download error
  - Deliberate extension service worker reload and/or suspension
  - Browser closing
- May cause memory issues for doujinshis with size larger than 50MB, therefore larger file size.
- Chrome download error when encountering titles with invalid "" character (or any other ASCII control characters) in its title
- Release packaging script still includes invalid nested ZIP files that is supposed to be the result of ZIP packaging

### Notes

This is an early beta release. Please expect issues and report them on GitHub.
