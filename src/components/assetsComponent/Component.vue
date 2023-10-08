<script>
import { h, defineComponent, computed, ref } from "vue";

export default defineComponent({
  props: {
    tag: String,
    message: String,
  },
  setup(props) {
    const { tag, message } = props;
    console.log("tag", tag);
    console.log("message", message);
    const selectedTag = {
      img: "src",
      a: "href",
    };
    const attribute = computed(() => ({
      [selectedTag[tag]]: message,
    }));

    return () => h(tag, attribute.value, message);
  },
});
</script>
