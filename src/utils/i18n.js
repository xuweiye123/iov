export function generateTitle(title) {
  // console.log(this.$te)
  const hasKey = this.$te('route.' + title)

  if (hasKey) {
    const translatedTitle = this.$t('route.' + title)
    return translatedTitle
  }
  return title
}
