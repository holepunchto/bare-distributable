cmake_minimum_required(VERSION 4.0)

find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

fetch_package("github:holepunchto/bare@1.24.3")

project(bare_distributable C)

add_bare_bundle(
  bare_distributable_bundle
  ENTRY src/main.js
  OUT src/main.bundle.h
  BUILTINS src/builtins.json
)

add_executable(bare_distributable)

target_sources(
  bare_distributable
  PRIVATE
    src/main.bundle.h
    src/main.c
)

set_target_properties(
  bare_distributable
  PROPERTIES
  OUTPUT_NAME my-bare
  ENABLE_EXPORTS ON
  WINDOWS_EXPORT_ALL_SYMBOLS ON
)

target_link_libraries(
  bare_distributable
  PUBLIC
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
)

link_bare_modules(bare_distributable)

install(TARGETS bare_distributable)
