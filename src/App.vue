<template>
  <div id="app" class="tw-bg-gray-300" style="overflow-x:hidden; min-height: 100vh;" >
    <router-view/>
    
  </div>
</template>

<script>

export default {
  components: {
  }
}
</script>


<style>
#style-1::-webkit-scrollbar-track
{
	border-radius: 0px;
	background-color: #f5f5f500;
}

#style-1::-webkit-scrollbar
{
	width: 8px;
	background-color: #ffffff00;
}

#style-1::-webkit-scrollbar-thumb
{
	border-radius: 0px;
	background-color: rgb(209, 209, 209);
}

*,*:focus,*:hover{
    outline:none !important;
}

</style>
