<template>
  <div class="d-flex flex-column h-100">
    <div id="nav">
      <b-card>
        <b-button class="mx-1" to="/">Home</b-button>
        <b-button class="mx-1" variant="info" to="/about">About</b-button>
      </b-card>
    </div>
    <router-view class="flex-fill" />
  </div>
</template>
