<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <nav>
                <ul class="list-inline">
                    <li>
                        <router-link :to="{ name: 'home' }">Home</router-link>
                    </li>
                    <li class="pull-right">
                        <router-link :to="{ name: 'login' }">Login</router-link>
                    </li>                    <li class="pull-right">
                        <router-link :to="{ name: 'register' }">Register</router-link>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="panel-body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
  
}
</script>
<style>

</style>

