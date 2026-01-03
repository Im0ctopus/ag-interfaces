<script lang="ts">
  import { Settings2 } from 'lucide-svelte'
  import Button from '../common/button.svelte'
  import Settings from './settings.svelte'

  let isOpen = $state(false)

  const toggleOpen = () => (isOpen = !isOpen)
</script>

<div class="absolute top-7 right-7">
  <div class="relative">
    <Button variant="icon" onclick={toggleOpen}>
      <Settings2 size="1.25rem" />
    </Button>
    <Settings {isOpen} onClose={toggleOpen} />
  </div>
</div>
