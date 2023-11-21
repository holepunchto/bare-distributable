cmake_minimum_required(VERSION 3.25)

set(name pear)

project(
  ${name}
  VERSION 1.0
  LANGUAGES C CXX
)

include(bare)

bare_target(target)

add_subdirectory(vendor/bare EXCLUDE_FROM_ALL)

add_compile_definitions(
  BARE_MODULE_REGISTER_CONSTRUCTOR
  NAPI_MODULE_REGISTER_CONSTRUCTOR
)

add_library(${name}_obj OBJECT)

set_target_properties(
  ${name}_obj
  PROPERTIES
  C_STANDARD 99
  CXX_STANDARD 20
  POSITION_INDEPENDENT_CODE ON
)

add_bare_bundle(
  ENTRY src/main.js
  OUT src/main.bundle.h
  IMPORT_MAP package.json
  TARGET c
)

target_sources(
  ${name}_obj
  PRIVATE
    src/main.bundle.h
    src/main.c
)

target_include_directories(
  ${name}_obj
  PUBLIC
    $<TARGET_PROPERTY:bare,INTERFACE_INCLUDE_DIRECTORIES>
)

add_executable(${name}_bin $<TARGET_OBJECTS:${name}_obj>)

set_target_properties(
  ${name}_bin
  PROPERTIES
  ENABLE_EXPORTS ON
  OUTPUT_NAME ${name}
)

target_link_libraries(
  ${name}_bin
  PRIVATE
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
)

link_bare_module(
  ${name}_bin
  bare_fs
  node_modules/bare-fs
)

link_bare_module(
  ${name}_bin
  bare_subprocess
  node_modules/bare-subprocess
)

link_bare_module(
  ${name}_bin
  bare_http1
  node_modules/bare-http1
)

link_bare_module(
  ${name}_bin
  bare_repl
  node_modules/bare-repl
)

link_bare_module(
  ${name}_bin
  bare_pipe
  node_modules/bare-pipe
)

link_bare_module(
  ${name}_bin
  bare_tty
  node_modules/bare-tty
)

link_bare_module(
  ${name}_bin
  bare_env
  node_modules/bare-env
)

link_bare_module(
  ${name}_bin
  bare_module
  node_modules/bare-module
)

install(
  TARGETS ${name}_bin
  RUNTIME DESTINATION ${target}
)
