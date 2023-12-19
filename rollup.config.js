import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    // 入口文件
    input: 'packages/vue/src/index.ts',
    // 打包出口
    output: [
      // 导出 iife 模式的包
      {
        // 开启 SourceMap
        sourcemap: true,
        // 导出的文件地址
        file: './packages/vue/dist/vue.js',
        // 生成的包格式：一个自动执行的功能，适合作为<script>标签
        format: 'iife',
        // 变量名
        name: 'Vue'
      }
    ],
    // 插件
    plugins: [
      // ts 支持
      typescript({
        sourceMap: true
      }),
      // 模块导入的路径补全
      resolve(),
      // 将 CommonJS 模块转换为 ES2015
      commonjs()
    ]
  }
]
