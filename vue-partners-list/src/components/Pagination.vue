<template>
    <div class="page-nav">
        <a
            v-show="selected!=1"
            class="page-nav__item  page-nav__item--prev"
            @click.stop="selectedPage(--selected)"
        >Prev</a>
        <template v-if="pages[0] != 1">
            <a
                class="page-nav__item"
                @click.stop="selectedPage(1)"
            >1</a>
            <span class="page-nav__item page-nav__item--dots">...</span>
        </template>
        <template v-for="page in pages">
            <a
                class="page-nav__item"
                :class="{'page-nav__item--active': selected==page}"
                @click.stop="selectedPage(page)"
            > {{ page }} </a>
        </template>
        <template v-if="pages[pages.length-1] != countPages">
            <span class="page-nav__item page-nav__item--dots">...</span>
            <a
                class="page-nav__item"
                @click.stop="selectedPage(countPages)"
            >{{countPages}}</a>
        </template>
        <a
            v-show="selected!=countPages"
            class="page-nav__item page-nav__item--next"
            @click.stop="selectedPage(++selected)"
        >Next</a>
    </div>
</template>

<script>
	export default {
		name: "Pagination",
        props: ['selected', 'countPages'],
        data: function() {
			return {}
        },
        methods: {
			selectedPage: function(page) {
				this.$emit('selection-page', page);
				this.$nextTick(function(){
					this.select = this.selected;
				});
            }
        },
        computed: {
			pages: function() {
				let pages, i;

				let startPage, endPage;

				if(this.countPages < 6) {
					startPage = 1;
					endPage = this.countPages;
                }else if(this.selected < 5) {
					startPage = 1;
					endPage = this.selected + 2;
                }else if(this.selected > (this.countPages - 4)) {
					startPage = this.selected - 2;
					endPage = this.countPages;
                }else{
					startPage = this.selected - 2;
					endPage = this.selected + 2;
                }

				pages = new Array();
				i=startPage;
				while(i < endPage + 1){pages.push(i++)};

				return pages;
            }
        }
	}
</script>

<style scoped>

</style>
