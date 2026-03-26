// ============================================================
//  src-tauri/src/commands/file_ops.rs
//  File-system Tauri commands. Each command is a thin wrapper
//  that delegates to helper functions so the logic is testable.
// ============================================================

use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use std::path::Path;
use tauri::command;

/// Reads an image file from `path` and returns a base64 data URL
/// (e.g. `data:image/png;base64,...`).
///
/// Using the `image` crate ensures we can support all common
/// formats and convert exotic ones to PNG for the canvas.
#[command]
pub async fn read_image_as_data_url(path: String) -> Result<String, String> {
    let path = Path::new(&path);

    // Detect MIME type from extension (before opening the file)
    let mime = mime_from_path(path);

    // Read raw bytes – this is fast even for large files
    let bytes = std::fs::read(path)
        .map_err(|e| format!("Failed to read file: {e}"))?;

    // For formats natively supported by browsers we pass bytes through as-is.
    // For unsupported formats we transcode to PNG via the `image` crate.
    let (data, final_mime) = if is_browser_native(mime) {
        (bytes, mime)
    } else {
        let img = image::load_from_memory(&bytes)
            .map_err(|e| format!("Failed to decode image: {e}"))?;
        let mut png_bytes = Vec::new();
        img.write_to(&mut std::io::Cursor::new(&mut png_bytes), image::ImageFormat::Png)
            .map_err(|e| format!("Failed to encode PNG: {e}"))?;
        (png_bytes, "image/png")
    };

    let encoded = BASE64.encode(&data);
    Ok(format!("data:{};base64,{}", final_mime, encoded))
}

fn mime_from_path(path: &Path) -> &'static str {
    match path.extension().and_then(|e| e.to_str()).map(|s| s.to_lowercase()).as_deref() {
        Some("png")                 => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("gif")                 => "image/gif",
        Some("webp")                => "image/webp",
        Some("svg")                 => "image/svg+xml",
        Some("bmp")                 => "image/bmp",
        Some("tiff") | Some("tif") => "image/tiff",
        Some("ico")                 => "image/x-icon",
        _                           => "image/png",
    }
}

/// Returns true if the browser can render this MIME type natively
/// without needing a transcode step.
fn is_browser_native(mime: &str) -> bool {
    matches!(
        mime,
        "image/png" | "image/jpeg" | "image/gif" | "image/webp" | "image/svg+xml"
    )
}
