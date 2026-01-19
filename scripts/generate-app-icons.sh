#!/bin/bash

# App Icon Generator Script
# Generiert alle notwendigen Icon-Größen für iOS und Android

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== App Icon Generator ===${NC}"

# Basis-Icon (sollte mindestens 1024x1024 sein)
# Verwende apple-touch-icon als Basis
ADMIN_ICON="../admin/public/apple-touch-icon.png"
PORTAL_ICON="../portal/public/apple-touch-icon.png"

# Funktion zum Generieren von Icons
generate_icons() {
    local SOURCE=$1
    local TARGET_DIR=$2
    local APP_NAME=$3

    echo -e "${GREEN}Generiere Icons für $APP_NAME...${NC}"

    # iOS Icons
    if [ -d "$TARGET_DIR/ios/App/App/Assets.xcassets/AppIcon.appiconset" ]; then
        echo "  -> iOS Icons..."
        cd "$TARGET_DIR/ios/App/App/Assets.xcassets/AppIcon.appiconset"

        # Verschiedene iOS Icon Größen
        sips -z 20 20 "$SOURCE" --out AppIcon-20x20@1x.png 2>/dev/null
        sips -z 40 40 "$SOURCE" --out AppIcon-20x20@2x.png 2>/dev/null
        sips -z 60 60 "$SOURCE" --out AppIcon-20x20@3x.png 2>/dev/null
        sips -z 29 29 "$SOURCE" --out AppIcon-29x29@1x.png 2>/dev/null
        sips -z 58 58 "$SOURCE" --out AppIcon-29x29@2x.png 2>/dev/null
        sips -z 87 87 "$SOURCE" --out AppIcon-29x29@3x.png 2>/dev/null
        sips -z 40 40 "$SOURCE" --out AppIcon-40x40@1x.png 2>/dev/null
        sips -z 80 80 "$SOURCE" --out AppIcon-40x40@2x.png 2>/dev/null
        sips -z 120 120 "$SOURCE" --out AppIcon-40x40@3x.png 2>/dev/null
        sips -z 120 120 "$SOURCE" --out AppIcon-60x60@2x.png 2>/dev/null
        sips -z 180 180 "$SOURCE" --out AppIcon-60x60@3x.png 2>/dev/null
        sips -z 76 76 "$SOURCE" --out AppIcon-76x76@1x.png 2>/dev/null
        sips -z 152 152 "$SOURCE" --out AppIcon-76x76@2x.png 2>/dev/null
        sips -z 167 167 "$SOURCE" --out AppIcon-83.5x83.5@2x.png 2>/dev/null
        sips -z 1024 1024 "$SOURCE" --out AppIcon-512@2x.png 2>/dev/null

        cd - > /dev/null
    fi

    # Android Icons
    if [ -d "$TARGET_DIR/android/app/src/main/res" ]; then
        echo "  -> Android Icons..."
        RES_DIR="$TARGET_DIR/android/app/src/main/res"

        # mipmap Ordner
        mkdir -p "$RES_DIR/mipmap-mdpi"
        mkdir -p "$RES_DIR/mipmap-hdpi"
        mkdir -p "$RES_DIR/mipmap-xhdpi"
        mkdir -p "$RES_DIR/mipmap-xxhdpi"
        mkdir -p "$RES_DIR/mipmap-xxxhdpi"

        sips -z 48 48 "$SOURCE" --out "$RES_DIR/mipmap-mdpi/ic_launcher.png" 2>/dev/null
        sips -z 72 72 "$SOURCE" --out "$RES_DIR/mipmap-hdpi/ic_launcher.png" 2>/dev/null
        sips -z 96 96 "$SOURCE" --out "$RES_DIR/mipmap-xhdpi/ic_launcher.png" 2>/dev/null
        sips -z 144 144 "$SOURCE" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher.png" 2>/dev/null
        sips -z 192 192 "$SOURCE" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png" 2>/dev/null

        # Round Icons (gleich wie normal für jetzt)
        cp "$RES_DIR/mipmap-mdpi/ic_launcher.png" "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"
        cp "$RES_DIR/mipmap-hdpi/ic_launcher.png" "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"
        cp "$RES_DIR/mipmap-xhdpi/ic_launcher.png" "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"
        cp "$RES_DIR/mipmap-xxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"
        cp "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

        # Foreground Icons für Adaptive Icons
        cp "$RES_DIR/mipmap-mdpi/ic_launcher.png" "$RES_DIR/mipmap-mdpi/ic_launcher_foreground.png"
        cp "$RES_DIR/mipmap-hdpi/ic_launcher.png" "$RES_DIR/mipmap-hdpi/ic_launcher_foreground.png"
        cp "$RES_DIR/mipmap-xhdpi/ic_launcher.png" "$RES_DIR/mipmap-xhdpi/ic_launcher_foreground.png"
        cp "$RES_DIR/mipmap-xxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"
        cp "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png" "$RES_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"
    fi

    echo -e "${GREEN}  Fertig!${NC}"
}

# Wechsle ins Script-Verzeichnis
cd "$(dirname "$0")"

# Generiere Icons für Admin App
if [ -f "$ADMIN_ICON" ]; then
    generate_icons "$(pwd)/$ADMIN_ICON" "$(pwd)/../admin" "Admin App"
else
    echo "Admin Icon nicht gefunden: $ADMIN_ICON"
fi

# Generiere Icons für Portal App
if [ -f "$PORTAL_ICON" ]; then
    generate_icons "$(pwd)/$PORTAL_ICON" "$(pwd)/../portal" "Portal App"
else
    echo "Portal Icon nicht gefunden: $PORTAL_ICON"
fi

echo -e "${BLUE}=== Fertig! ===${NC}"
echo ""
echo "Nächste Schritte:"
echo "1. Öffne Xcode: npx cap open ios"
echo "2. Öffne Android Studio: npx cap open android"
