<script>
import { h, defineComponent, computed, ref, onUpdated } from "vue";

export default defineComponent({
  props: {
    tag: String,
    message: String,
  },
  setup(props) {
    const { tag, message } = props;
    console.log("tag", tag);
    console.log("message", message);
    const selectedTag = ref({
      img: "src",
      a: "href",
    });
    onUpdated(() => "update");
    const attribute = computed(() => ({ [selectedTag.value[tag]]: message }));

    return () => h(tag, attribute.value, message);
  },
});
</script>
