<template>
    <div>
        <div v-if="ajaxLoadingData == true">
            {{ textLoading }}
        </div>
        <template v-else>
            <div v-show="typeof getPartner() == 'undefined' && partnersTag.length == 0">{{ textSearchEmpty }}</div>
            <template v-if="partnersTag.length > 0">
                <div class="alphabet-result-section">
                    <div class="museums-list">
                        <div class="museum__item" v-for="partnerItem in partnersTag">
                            <PartnerItemCard
                                :check-filter-in-city="checkFilterInCity"
                                :partner-item-data="partnerItem"
                                :filter-text="filterText"
                                :text-title-tags="textTitleTags"
                                :is-bold="true"
                                :link-search-tag="linkSearchTag"
                            ></PartnerItemCard>
                        </div>
                    </div>
                </div>
            </template>
            <div class="alphabet-result-section" v-for="letterItem in showPartnerItems">
                <h2 class="section-title">{{ letterItem.letter }}</h2>
                <div class="museums-list">
                    <div class="museum__item" v-for="partnerItem in letterItem.items">
                        <PartnerItemCard
                            :check-filter-in-city="checkFilterInCity"
                            :partner-item-data="partnerItem"
                            :filter-text="filterText"
                            :text-title-tags="textTitleTags"
                            :link-search-tag="linkSearchTag"
                        ></PartnerItemCard>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
	import PartnerItemCard from './PartnerItemCard'
	export default {
		props: ['ajaxLoadingData', 'checkFilterInCity', 'partnerItems', 'partnersTag', 'filterText', 'linkSearchTag', 'textLoading', 'textSearchEmpty', 'textTitleTags'],
		name: "PartnerItems",
        methods: {
			getPartner: function() {
				return this.partnerItems
            }
        },
        computed: {
			showPartnerItems: function() {
				let showPartners, returnPartners;
				showPartners = this.getPartner();
				returnPartners = new Array();

				let returnPartnersNew;
				returnPartnersNew = {};

				let i;
				let letter;
				for(i in showPartners) {
					letter = showPartners[i].letter;
					if(typeof returnPartnersNew[letter] == 'undefined') {
						returnPartnersNew[letter] = {
							'letter': letter,
							'items': new Array()
                        };
                    }

					returnPartners.push(showPartners[i]);
					returnPartnersNew[letter]['items'].push(showPartners[i]);
                }
				return returnPartnersNew;
            }
        },
        components: {
			PartnerItemCard
		}
	}
</script>
