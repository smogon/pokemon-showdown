srcdir = "."
blddir = "build"
VERSION = "0.0.1"

def set_options(opt):
  opt.tool_options("compiler_cxx")
  opt.tool_options("compiler_cc")

def configure(conf):
  conf.check_tool("compiler_cxx")
  conf.check_tool("compiler_cc")
  conf.check_tool("node_addon")
  conf.env.append_value('CPPFLAGS', ['-Du_int32_t=uint32_t', '-Du_int16_t=uint16_t'])
  conf.env.append_value('CCFLAGS', ['-O3'])

def build(bld):
  libhash = bld.new_task_gen("cc", "shlib")
  libhash.source = """
	libhash/md4c.c
	libhash/md5c.c
	libhash/sha0c.c"""
  libhash.includes = "libhash/"
  libhash.name = "libhash"
  libhash.target = "libhash"

  obj = bld.new_task_gen("cxx", "shlib", "node_addon")
  obj.target = "hashlib"
  obj.source = "hashlib.cc"
  obj.includes = "libhash"
  obj.add_objects = "libhash"
