<template>
  <div class="catalog-section">
    <div class="filter-catalog-section">
      <h1 class="inner-page-title museums-title">{{ titleText }}</h1>
      <div class="body-popup filter-area-body-popup">
        <div class="body-popup-heading-row">
          <strong class="body-popup-title">{{ setting.filterSearchText }}</strong>
          <a href="#" class="body-popup-close" @click="clickMobyClose">{{ setting.filterClose }}</a>
        </div>
        <div class="body-popup-scrollable">
          <div class="body-popup-scrollable-holder">
            <FilterAlphabet
                :all-letter="allLetter"
                :active-letter="activeLetter"
                :is-moby="1"
                :text-all="setting.letterAll"
                @selected="selectedLetter"
                v-show="ajaxLoadingData == false"
            ></FilterAlphabet>

            <div class="filter-area">
              <FilterForm
                  :is-moby="isMoby"
                  :check-filter-in-city="checkFilterInCity"
                  :all-city="allCity"
                  :filter-text="filterText"
                  :filter-country="filterCountry"
                  :filter-city="filterCity"

                  :text-name="setting.filterName"
                  :text-country="setting.filterCountry"
                  :text-city="setting.filterCity"
                  :text-checked-country="setting.filterCheckedCountry"
                  :text-checked-city="setting.filterCheckedCity"
                  :text-show="setting.filterShow"
                  :text-clear-all="setting.filterClearAll"

                  @selected-text="selectedText"
                  @selected-country="selectedCountry"
                  @selected-city="selectedCity"
              ></FilterForm>
              <div class="filter-museums-btn__row" v-if="setting.partnerShow">
                <a class="btn filter-btn--partners" :href="setting.partnerLink" v-html="setting.partnerButton"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="products-catalog-section">
      <FilterAlphabet
          v-show="ajaxLoadingData == false"
          :all-letter="allLetter"
          :active-letter="activeLetter"
          :is-moby="0"
          :text-all="setting.letterAll"
          @selected="selectedLetter"
      ></FilterAlphabet>
      <div class="btn-filter-opener-wrapper btn-filter-opener-wrapper--museum">
        <a
            @click="clickMobyFilter"
            href="#"
            class="btn btn-filter-opener btn-filter-opener--museum"
        >
          <span class="btn-filter-opener__img">
              <svg viewBox="0 0 32 32" width="25" height="25">
                  <use xlink:href="#settings"></use>
              </svg>
          </span><span class="btn-filter-opener__text">{{ setting.filterTitle }}</span>
        </a>
      </div>
      <PartnerItemsList
          :ajax-loading-data="ajaxLoadingData"
          :check-filter-in-city="checkFilterInCity"
          :partner-items="showPartnerItems"
          :partners-tag="showPartnerInTagItems"
          :filter-text="filterText"
          :link-search-tag="linkSearchTag"
          :text-loading="setting.pageLoadingData"
          :text-search-empty="setting.pageSearchEmpty"
          :text-title-tags="setting.pageTitleTags"
      ></PartnerItemsList>
      <Pagination
        :count-pages="countPages"
        :selected="selectedPage"
        @selection-page="selectionPage"
        v-show="countPages > 1 && ajaxLoadingData == false"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from './components/Pagination'
import FilterAlphabet from './components/FilterAlphabet'
import FilterForm from './components/FilterForm'
import PartnerItemsList from './components/PartnerItemsList'

export default {
  name: 'App',
  data: function(){
    return {
      /** флаг - загрузка данных **/
      ajaxLoadingData: true,
      /** флаг - фильтровать/не фильтровать по стране/городу**/
      checkFilterInCity: true,
      /** заголовок в верхнем левом углу **/
      titleText: '',
      /** хранилище всех партнеров **/
      partnerItems: [],
      /** флаги и строки промежуточных состояний
       *
       * activeLetter - выбранная буква
       *
       * == фильтр ==
       * filterText - значение текс в фильтре, используется для фильтрации по названию и тегу
       * filterCountry - фильтр, выбранная страна
       * filterCity - фильтр, выбранный город
       *
       * == пагинация ==
       * countPages - количество страниц
       * countRowInPage - количество элементов на странице
       * selectedPage - текущая страница
       * **/
      activeLetter: '',
      countPages: 1,
      countRowInPage: 10,
      selectedPage: 1,
      filterText: '',
      filterCountry: '',
      filterCity: '',
      /** ключи специфичные для мобильной версии
       * мобильная версия отличается тем, что показывается кнопка применить фильтр
       * так же сущестует возможность отката фильтра и выбранной буквы, по крестику
       *
       * isMoby - флаг - клиент на мобилке. Определяется по кнопке "фильтр", которая показывается только в моб.версии
       * mobyFilterInitData - проммежуточное хранилище, в котором хранятся данные при вызове фильтра (для отката)
       * **/
      isMoby: false,
      mobyFilterInitData: [],
      /** паттерны ссылок для шаблонов **/
      linkSearchTag : '/search/index.php?q=%s',
      setting: {
        'partnerShow': true,
        'partnerButton': '+ <span>Стать партнером</span>',
        'partnerLink': '/form-partner.php',
      }
    }
  },
  computed: {
    allLetter: function() {
      let item, returnData, i;
      returnData = {};

      for (i in this.partnerItems) {
        item = this.partnerItems[i];
        if(typeof returnData[item.letter] == 'undefined') {
          returnData[item.letter] = {
            letter: item.letter
          }
        }
      }
      return returnData;
    },
    allCity: function() {
      let item, returnData, i;
      returnData = {};
      for (i in this.partnerItems) {
        item = this.partnerItems[i];
        if(typeof returnData[item.country] == 'undefined') {
          returnData[item.country] = {
            'name': item.country,
            'cities': {}
          };
        }
        if(typeof returnData[item.country]['cities'][item.city] == 'undefined') {
          returnData[item.country]['cities'][item.city] = {
            'name': item.city
          }
        }
      }
      return returnData;
    },
    showPartnerInTagItems: function() {
      let returnData, i, tags, strSearch;

      returnData = new Array();

      for(i in this.partnerItems) {
        if(this.filterText != '') {
          tags = this.partnerItems[i]['tags'];
          strSearch = this.filterText;

          if(typeof tags.find(function(element) {
            return element.toUpperCase() == strSearch.toUpperCase();
          }) != 'undefined') {
            returnData.push(this.partnerItems[i])
          }
        }
      }

      // return [];
      return returnData;
    },
    showPartnerItems: function() {
      let returnData, i;
      let nameOrig, strSearch, tags;
      returnData = new Array();

      for(i in this.partnerItems) {
        // проверка на выделенную букву
        if(this.activeLetter != '') {
          if(this.partnerItems[i]['letter'] != this.activeLetter) {
            continue;
          }
        }

        if(this.filterText != '') {
          nameOrig = this.partnerItems[i]['name'];
          tags = this.partnerItems[i]['tags'];
          strSearch = this.filterText;

          if(-1 == nameOrig.toUpperCase().indexOf(strSearch.toUpperCase())) {
              continue;
          }
        }

        if(this.filterCity != '') {
          if(this.partnerItems[i]['city'] != this.filterCity) {
            continue;
          }
        }else if(this.filterCountry != '') {
          if(this.partnerItems[i]['country'] != this.filterCountry) {
            continue;
          }
        }

        returnData.push(this.partnerItems[i]);
      }

      // просчет музеев которые попадают на текущую страницу согласно навигации
      returnData = returnData.chunk_inefficient(this.countRowInPage);
      if(this.selectedPage != 1 &&  typeof returnData[this.selectedPage-1] == 'undefined') {
        this.selectedPage = 1;
      }

      if(returnData.length > 1) {
        this.countPages = returnData.length;
      }else{
        this.countPages = 1;
      }
      return returnData[this.selectedPage-1];
    }
  },
  created: function () {
    var checkKeys = [
      'pageLoadingData',
      'pageTextErrorLoadingData',
      'pageSearchEmpty',
      'pageTitleTags',

      'filterSearchText',
      'filterTitle',
      'filterName',
      'filterCountry',
      'filterCity',
      'filterCheckedCountry',
      'filterCheckedCity',
      'filterClose',
      'filterShow',
      'filterClearAll',

      'letterAll',

      'partnerShow',
      'partnerButton',
      'partnerLink'
    ];
    var key;
    for (key in checkKeys) {
      if (typeof partnersSetting[checkKeys[key]] != 'undefined') {
        this.setting[checkKeys[key]] = partnersSetting[checkKeys[key]];
      }
    }


    if (typeof partnersSetting.partnerShow != 'undefined') {
      this.setting.partnerShow = partnersSetting.partnerShow;
    }



    if (typeof partnersSetting.titleText != 'undefined') {
      this.titleText = partnersSetting.titleText;
    }
    if (typeof partnersSetting.itemsInPage != 'undefined') {
      this.countRowInPage = parseInt(partnersSetting.itemsInPage);
    }
    if (typeof partnersSetting.checkFilterInCity != 'undefined') {
      if (partnersSetting.checkFilterInCity == false) {
        this.checkFilterInCity = false;
      }
    }

    if (typeof partnersSetting.linkSearchTag != 'undefined') {
      this.linkSearchTag = partnersSetting.linkSearchTag;
    }

    this.loadData();
  },
  methods: {
    /** загрузка данных **/
    loadData: function() {
      let urlInit;
      let host;

      if(
          typeof partnersSetting.debug != 'undefined'
          && typeof partnersSetting.debugUrl == "string"
      ) {
        host = partnersSetting.debugUrl; // debug mode
      }else{
        host = '';
      }

      urlInit = host + '?ajax=y';

      this.ajaxLoadingData = true;
      this.$http.get(urlInit).then(responce => {
        if(typeof responce.data == 'object') {
          this.partnerItems = responce.data;

          this.activeLetter = '';
          this.filterText = '';
          this.filterCountry = '';
          this.selectedPage = 1;

          if(typeof partnersSetting.startLetter == 'string') {
            if (typeof this.allLetter[partnersSetting.startLetter] != 'undefined') {
              this.activeLetter = partnersSetting.startLetter;
            }
          }
          this.ajaxLoadingData = false;

          this.$nextTick(function(){
            window.jcf.refreshAll();
          });
        }else{
          alert(this.setting.pageTextErrorLoadingData)
        }
      }, responce => {
        if(typeof partnersSetting.debugUrl == "string") {
          console.log('убедитесь что страница существует и присутствует строка: '+
              'header(\'Access-Control-Allow-Origin: *\');'
          );
        }else{
          alert('fail load');
        }
      })
    },
    /** фильтр, моб.версия - нажата кнопка применить **/
    clickMobyFilter: function() {
      this.isMoby = true;
      this.mobyFilterInitData = {
        filterText: this.filterText,
        filterCountry: this.filterCountry,
        filterCity: this.filterCity,
        activeLetter: this.activeLetter
      };
    },
    /** фильтр, моб.версия - нажата кнопка закрыть **/
    clickMobyClose: function() {
      this.filterText = this.mobyFilterInitData.filterText;
      this.filterCountry = this.mobyFilterInitData.filterCountry;
      this.filterCity = this.mobyFilterInitData.filterCity;
      this.activeLetter = this.mobyFilterInitData.activeLetter;
      this.$nextTick(function(){
        window.jcf.refreshAll();
      });
    },
    /** обработчики событий при изменении значений в фильтре **/
    selectedLetter: function(letter) {
      this.selectedPage = 1;
      this.activeLetter = letter;
    },
    selectedText: function(text) {
      this.selectedPage = 1;
      this.filterText = text;
    },
    selectedCountry: function(country) {
      this.selectedPage = 1;
      this.filterCountry = country;
    },
    selectedCity: function(city) {
      this.selectedPage = 1;
      this.filterCity = city;
    },
    /** обработчик события при выборе страницы **/
    selectionPage: function(page) {
      this.selectedPage = page;
      this.$scrollTo('.main-content-area');
    }
  },
  components: {
    FilterAlphabet,
    FilterForm,
    Pagination,
    PartnerItemsList
  }
}
</script>
