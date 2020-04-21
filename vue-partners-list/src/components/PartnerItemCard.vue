<template>
    <div
        class="museum__item-wrapper"
        :class="[isBold ? boldClass : '']"
    >
        <div class="museum__item-img">
            <img :src="partnerItemData.image" alt="">
        </div>
        <div
            class="museum__item-description"
            v-html="highlightText(partnerItemData.name, filterText)"
        ></div>
        <div class="museum__item-location" v-if="checkFilterInCity">
            {{ partnerItemData.country }}, {{ partnerItemData.city }}
        </div>
        <div class="museum__item-nav" v-show="partnerItemData.links.length > 0">
            <template v-for="partnerLink in partnerItemData.links">
                <a class="" :href="partnerLink.link">{{ partnerLink.title }}</a>
            </template>
        </div>
        <div class="museum__item-tags" v-if="partnerItemData.tags.length > 0">
                            <span class="museum__item-tags-title">
                                {{ textTitleTags }}:
                            </span>
            <span class="museum__item-tags-list">
                                <template v-for="tag in partnerItemData.tags">
                                    <a
                                        :href="linkSearchTag.replace('%s', tag)"
                                        :class="{active: filterText == tag}"
                                    >#{{ tag }}</a>
                                </template>
                            </span>
        </div>
        <a class="catalog__item-link" :href="partnerItemData.detail_url"></a>
    </div>
</template>

<script>
	export default {
		props: ['checkFilterInCity', 'partnerItemData', 'filterText', 'isBold', 'linkSearchTag', 'textTitleTags'],
		name: "PartnerItemCard",
		data: function() {
			return {
				boldClass: 'bold-card'
            };
		},
		methods: {
			highlightText: function(name, filterText) {
				if(filterText == '') {
					return name;
				}

				let out, pos;
				pos = name.toUpperCase().indexOf(filterText.toUpperCase());
				out =
					name.substr(0, pos) +
					'<b>' + name.substr(pos, filterText.length) + '</b>'
					+ name.substr(pos+filterText.length);
				return out;
			}
		}
	}
</script>
<style>
    .bold-card {border: 3px solid}
</style>
