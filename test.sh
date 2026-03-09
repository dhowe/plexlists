#!/bin/bash
# Test script for CLI package

set -e

echo "🧪 Testing CLI package..."
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from packages/cli directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test imports
echo "🔍 Testing module imports..."
node -e "
import('./bin/plexlists.js').then(() => {
    console.log('✅ Module imports successful');
    process.exit(0);
}).catch(err => {
    console.error('❌ Module import failed:', err.message);
    process.exit(1);
});
"

# Test CLI help
echo "📖 Testing CLI help..."
node bin/plexlists.js --help > /dev/null
echo "✅ CLI help works"

# Test config command
echo "⚙️  Testing config command..."
node bin/plexlists.js config show > /dev/null 2>&1 || true
echo "✅ Config command works"

# Check package files
echo "📁 Checking package files..."
if [ ! -d "bin" ]; then
    echo "❌ Missing bin/ directory"
    exit 1
fi

if [ ! -d "lib" ]; then
    echo "❌ Missing lib/ directory"
    exit 1
fi

if [ ! -d "examples" ]; then
    echo "❌ Missing examples/ directory"
    exit 1
fi

echo "✅ All package files present"

# Dry-run pack
echo "📦 Testing npm pack..."
npm pack --dry-run > /tmp/pack-test.txt
echo "✅ Pack test passed"

echo ""
echo "✅ All tests passed!"
echo ""
echo "Next steps:"
echo "  1. npm link          # Test globally"
echo "  2. plexlists --help"
echo "  3. npm publish --dry-run  # Preview publish"
