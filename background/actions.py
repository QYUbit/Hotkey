import os
import webbrowser
import pyautogui
import subprocess
import platform

def open_url_action(url):
    webbrowser.open(url)

def open_app_action(path):
    if platform.system() == "Windows":
        os.startfile(path)
    elif platform.system() == "Darwin":
        subprocess.Popen(["open", path])
    else:
        subprocess.Popen([path])

def send_text_action(text):
    pyautogui.write(text, interval=0.05)

def take_screenshot_action(filename):
    screenshot = pyautogui.screenshot()
    screenshot.save(filename)

def set_volume_action(level):
    level = int(level)
    if platform.system() == "Windows":
        os.system(f"nircmd.exe setsysvolume {int(level * 65535 / 100)}")
    elif platform.system() == "Darwin":
        os.system(f"osascript -e 'set volume output volume {level}'")
    else:
        os.system(f"amixer sset 'Master' {level}%")

actions_dict = {
    "openUrl": open_url_action,
    "openApp": open_app_action,
    "sendText": send_text_action,
    "takeScreenshot": take_screenshot_action,
    "setVolume": set_volume_action,
}
