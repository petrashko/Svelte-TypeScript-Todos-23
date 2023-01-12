<script lang="ts">
    let greet: string = 'Hello stranger!';

    //console.log($$slots);
</script>

<div>
    <div class="header-container">
        <slot name="headerSlot" greeting={greet}></slot>
    </div>

    <div class="content-container">
        <slot>WoW!</slot>
    </div>

    <div class="footer-container">
        <slot name="footerSlot"></slot>
    </div>
</div>

<style>
    .header-container {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content-container {
        padding: 10px;
    }

    .footer-container {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
