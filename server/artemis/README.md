# Artemis

This is the source code for PS's moderation AI, Artemis. 

It has two versions, one local and one remote.

The remote version uses Google's `Perspective API` to classify messages, and requires a key set in `Config.perspectiveKey`.

Google's Perspective API ends after 2026. To use a Perspective-compatible service instead, set its base URL in `Config.perspectiveUrl` (by default `https://commentanalyzer.googleapis.com/v1alpha1`), for example `https://api.unprofane.com/v1alpha1`, and its key in `Config.perspectiveKey`.

The local version uses `detoxify` to classify messages. Before using it, run `./server/artemis/install` (this script installs dependencies and the model the local version uses).

