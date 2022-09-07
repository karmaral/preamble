<script lang="ts">

  let now = new Date();

  function tickDate() {
    now = new Date();
    setTimeout(tickDate, 1000);
  }
  function printDate(date: Date){
    const hours = date.getHours();
    const mins = date.getMinutes();
    const hh = String(hours).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');

    return `${hh}:${mm}`;
  }

  tickDate();
</script>

<div class='time'><span>{printDate(now)}</span></div>

<style>
  .time {
    font-size: 11rem;
    font-weight: 400;
    letter-spacing: -5px;
    line-height: 1;
  }
</style>
