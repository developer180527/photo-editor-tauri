// ============================================================
//  src-tauri/src/lib.rs
//  All Tauri commands are registered here.
//  Rule: Keep command functions thin. Heavy logic goes in
//  sub-modules (commands/file_ops.rs, etc.).
// ============================================================

mod commands;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::file_ops::read_image_as_data_url,
        ])
        .setup(|app| {
            // Dev: open devtools automatically
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
