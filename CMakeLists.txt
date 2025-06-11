cmake_minimum_required(VERSION 3.31)

find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

fetch_package("github:holepunchto/bare@1.19.0")

set(name bare_distributable)

project(${name} C)

add_bare_bundle(
  ${name}_bundle
  ENTRY src/main.js
  OUT src/main.bundle.h
  BUILTINS src/builtins.json
)

add_executable(${name})

target_sources(
  ${name}
  PRIVATE
    src/main.bundle.h
    src/main.c
)

set_target_properties(
  ${name}
  PROPERTIES
  ENABLE_EXPORTS ON
  MACOSX_BUNDLE OFF
  WINDOWS_EXPORT_ALL_SYMBOLS ON
)

target_link_libraries(
  ${name}
  PUBLIC
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
)

link_bare_modules(${name})

install(TARGETS ${name})
