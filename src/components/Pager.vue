<template>
		<div class="pagerInnerContainer">
            <div class="pagerBt" @click="prev">
                <label >Prev</label>
            </div>
			<div class="desc">
				PAGE <span style="font-size : 22px ;">{{pageNumber}}</span> of {{limit}}
			</div>
            <div class="pagerBt" @click="next">
                <label >Next</label>
            </div>
	</div>

</template>

<script>
export default {
	name: "pager",
	props: ['limit'],
	components: {
	},
	data() {
			return {
				pageNumber : 1
			};
	},
	ready: function() {},
	methods: {
		next(){
			if(this.pageNumber >= this.limit){
				return;
			}
			this.pageNumber = this.pageNumber + 1;
			this.$emit("onPageChanged" , this.pageNumber);
		},
		prev(){
			if(this.pageNumber <= 1){
				return;
			}
			this.pageNumber = this.pageNumber - 1;
			this.$emit("onPageChanged" , this.pageNumber);
		},
	},
	mounted() {
		console.log("pager mounted");
	 }
};
</script>

<style lang="css">

.pagerInnerContainer{
	min-width: 200px;
	height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    border: 0.5px solid rgb(47, 125, 246);
    border-radius: 5px;
    
}

.pagerBt{
	width: 50px;
    height: 50px;
    line-height: 50px;
	transition: all 0.25s;
    color: black;
    text-align: center;

}

.pagerBt:hover{
	font-weight: bolder;
color: rgb(47, 125, 246);
}

.desc{
	width: 180px;
	height: 50px;
	line-height: 50px;
	color: black;
	font-size: 12px;
	font-weight: 600;
	text-align: center;
    font-family: medium;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: rgb(47, 125, 246);
}



</style>
