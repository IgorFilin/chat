<script>
import { h, defineComponent, computed, ref } from "vue";

export default defineComponent({
  props: {
    tag: String,
    message: String,
  },
  setup(props) {
    const { tag, message } = props;
    const selectedTag = {
      img: {
        src: "",
        class: "v-mainPage_messageImage",
      },
      a: "href",
    };
    const attribute = computed(() => ({
      ...selectedTag[tag],
      src: tag === "img" && message,
    }));

    return () => h(tag, attribute.value, message);
  },
});
</script>
