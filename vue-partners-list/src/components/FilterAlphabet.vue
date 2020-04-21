<template>
    <div class="alphabet-filter "
        :class="{
            'alphabet-filter--museums': isMoby != 1,
            'alphabet-filter--popup': isMoby == 1
        }"
    >
        <a
            class="alphabet-control alphabet-control--all"
            :class="{active: activeLetter==''}"
            @click.stop="$emit('selected', '')"
        >{{ textAll }}</a>
        <template v-for="letter in allLetter">
            <a
                class="alphabet-control"
                :class="{active: activeLetter==letter.letter}"
                @click.stop="$emit('selected', letter.letter)"
            >{{ letter.letter }}</a>
        </template>
    </div>
</template>

<script>
	export default {
		name: "FilterAlphabet",
		props: ['allLetter', 'activeLetter', 'isMoby', 'textAll'],
	}
</script>

