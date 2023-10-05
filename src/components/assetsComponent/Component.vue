<script>
import { h, defineComponent } from "vue";

export default defineComponent({
  props: {
    tag: String,
  },
  setup(props) {
    const { tag } = props;
    console.log(tag);
    return () => h(tag, "This is a dynamic component");
  },
});
</script>
