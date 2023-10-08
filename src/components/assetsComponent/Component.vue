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
    console.log(attribute.value);

    return () => h(tag, attribute.value, message);
  },
});
</script>
