<script>
import { h, defineComponent, computed, ref } from "vue";

export default defineComponent({
  props: {
    message: String,
  },
  setup(props) {
    const { message } = props;
    console.log(message);
    let tag = "div";

    const patternLink = /^(http|https|www)/;
    const patternBlob = /^blob:http/;

    if (patternBlob.test(message)) {
      tag = "img";
    } else if (patternLink.test(message)) {
      tag = "a";
    }
    console.log(tag);

    const selectedTag = {
      img: {
        src: message,
        class: "v-mainPage_messageImage",
      },
      a: {
        href: message,
        target: "_blank",
      },
    };

    const attribute = computed(() => ({
      ...selectedTag[tag],
    }));
    console.log(attribute.value);
    return () => h(tag, attribute.value, tag !== "img" && message);
  },
});
</script>
