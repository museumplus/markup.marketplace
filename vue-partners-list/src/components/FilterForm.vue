<template>
    <form action="#" method="post">
        <div class="filter-box filter-detail-box filter-box--museums">
            <div class="">
                <div class="filter-field-item">
                    <label class="filter-label" for="museums">{{ textName }}:</label>
                    <input class="filter-text-field" type="text" id="museums" v-model="selectedText">
                </div>
                <template v-if="checkFilterInCity">
                    <div class="filter-field-item">
                        <label class="filter-label" for="museum-country">{{ textCountry }}:</label>
                        <select
                            id="museum-country" class="select-country"
                            v-model="selectedCountry"
                        >
                            <option value="">{{ textCheckedCountry }}</option>
                            <template v-for="country in listCountries">
                                <option :value="country">{{country}}</option>
                            </template>
                        </select>
                    </div>
                    <div class="filter-field-item" v-show="selectedCountry != ''">
                        <label class="filter-label" for="museum-city">{{ textCity }}:</label>
                        <select
                            id="museum-city" class="select-city"
                            v-model="selectedCity"
                        >
                            <option value="">{{ textCheckedCity }}</option>
                            <template v-for="city in listCities">
                                <option :value="city">{{ city }}</option>
                            </template>
                        </select>
                    </div>
                </template>
            </div>
            <div class="filter-submit-row" v-if="isMoby">
                <input
                    class="btn btn-submit btn-submit--museums"
                    type="submit"
                    :value=textShow
                    @click.stop.prevent="applyFilter"
                >
            </div>
            <div class="btn-row btn-row--museums" v-show="showClearFilterButton">
                <input class="filter-reset-btn" type="reset" :value="textClearAll" @click="clearAll">
            </div>
        </div>
    </form>
</template>

<script>
	export default {
		props: ['checkFilterInCity', 'allCity', 'filterText', 'filterCountry', 'filterCity',
			'textName',
			'textCountry',
			'textCity',
			'textCheckedCountry',
			'textCheckedCity',
			'textShow',
			'textClearAll',
            'isMoby'
        ],

		name: "FilterForm",
        data: function() {
			return {}
        },
        computed: {
			showClearFilterButton: function() {
				return (this.filterText != '' || this.filterCountry != '');
            },
			selectedText: {
				get() {
					return this.filterText;
                },
                set(value) {
					this.$emit('selected-text', value);
                }
            },
			selectedCountry: {
				get() {
                    return this.filterCountry;
                },
                set(value) {
                    value = value.split('!')[0]; // явно хак, нужно было лишь значение
                    this.$emit('selected-country', value);
					this.$emit('selected-city', '');
					this.$nextTick(function(){
						window.jcf.refreshAll();
					});
                }
            },
			selectedCity: {
				get() {
                    return this.filterCity;
                },
                set(value) {
                    value = value.split('!')[0]; // явно хак, нужно было лишь значение
					this.$emit('selected-city', value);
					this.$nextTick(function(){
						window.jcf.refreshAll();
					});
                }
            },
			'listCountries': function() {
				let countyItems = new Array();
				let i;
				for (i in this.allCity) {
					countyItems.push(this.allCity[i]['name']);
                }
				return countyItems;
            },
			'listCities': function() {
				if(this.selectedCountry == '') {
					return {};
                }
				let country = this.selectedCountry;
				if(typeof this.allCity[country] == 'undefined') {
					return {};
                }
				if(typeof this.allCity[country]['cities'] == 'undefined') {
					return {};
                }
				let cityItems = new Array();
				let i;
				for (i in this.allCity[country]['cities']) {
					cityItems.push(this.allCity[country]['cities'][i]['name']);
                }
				return cityItems;
            }
        },
        methods: {
			applyFilter: function() {
				window.jQuery(".body-popup-close:visible").click();
            },
			clearAll: function() {
				this.selectedText = '';
				this.selectedCountry = '';
			}
		}
	}
</script>

