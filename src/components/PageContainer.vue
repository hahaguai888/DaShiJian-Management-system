<template>
  <el-card class="page-container" style="min-width: 100%">
    <template #header>
      <div class="card-header">
        <div><slot name="title"></slot></div>
        <div><slot name="extra"></slot></div>
      </div>
    </template>
    <slot><slot name="empty"></slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
