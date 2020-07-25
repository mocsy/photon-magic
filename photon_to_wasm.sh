#!/bin/bash
git submodule init
curl https://sh.rustup.rs -sSf | sh -s -- --profile minimal -q -y
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
cd photon/crate
git reset --hard
echo -en '\n\n' >> Cargo.toml
echo "[profile.release]" >> Cargo.toml
echo 'lto = true' >> Cargo.toml
echo "opt-level = 's'" >> Cargo.toml
wasm-pack build --target web
base64 -w0 pkg/photon_rs_bg.wasm > pkg/photon_rs_bg.wasm64
ls -laph pkg/
cd ../../
cd src/components/photon-magic
rm photon_wasm_64.tsx
echo -n 'const photon_wasm_64 = "' >> photon_wasm_64.tsx
cat ../../../photon/crate/pkg/photon_rs_bg.wasm64 >> photon_wasm_64.tsx
echo -n '"' >> photon_wasm_64.tsx
echo -en '\n\nexport default photon_wasm_64' >> photon_wasm_64.tsx
