/**
 * Auto-sync color + size selects with hidden variant select
 * Supports multiple forms with class "product-form" (or change selector below)
 */

(function() {
  //console.log('🟢 Script loaded and executing...');

  if (document.readyState === 'loading') {
    console.warn('⚠️ Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', init);
  } else {
    //console.log('✅ DOM already loaded, initializing immediately...');
    init();
  }

  function init() {
    //console.log('🔵 init() function started');

    // Use your form selector – change if needed
    const forms = document.querySelectorAll('.pair-product-form-element');
    //console.log(`📋 Found ${forms.length} form(s) with class 'pair-product-form-element'`);

    if (forms.length === 0) {
      console.warn('❌ No forms found with class "product-form". Make sure your form has this class, or change the selector.');
      return;
    }

    forms.forEach((form, idx) => {
      //console.log(`\n--- Processing form ${idx + 1} ---`);
      //console.log(`Form element:`, form);

      const colorSelect = form.querySelector('select[name="color"]');
      const sizeSelect = form.querySelector('select[name="size"]');
      const variantSelect = form.querySelector('select[name="id"]');

      //console.log(`🔍 Inside form ${idx + 1}:`);
      //console.log(`  - select[name="color"]: ${colorSelect ? '✓ found' : '✗ NOT FOUND'}`);
      //console.log(`  - select[name="size"]: ${sizeSelect ? '✓ found' : '✗ NOT FOUND'}`);
      //console.log(`  - select[name="id"]: ${variantSelect ? '✓ found' : '✗ NOT FOUND'}`);

      if (!colorSelect || !sizeSelect || !variantSelect) {
        console.warn(`❌ Form ${idx + 1} is missing required selects. Skipping this form.`);
        return;
      }

      // Log all variant options for debugging
      //console.log(`📦 Variant options (${variantSelect.options.length} total):`);
      for (let i = 0; i < variantSelect.options.length; i++) {
        //console.log(`   ${i}: ${variantSelect.options[i].textContent}`);
      }

      //console.log(`🎨 Current selected color: "${colorSelect.value}"`);
      //console.log(`📏 Current selected size: "${sizeSelect.value}"`);

      function syncVariant() {
        const selectedColor = colorSelect.value;
        const selectedSize = sizeSelect.value;
        //console.log(`🔄 syncVariant() called - Color: "${selectedColor}", Size: "${selectedSize}"`);

        let matched = false;
        for (let i = 0; i < variantSelect.options.length; i++) {
          const option = variantSelect.options[i];
          const text = option.textContent;
          // Check if option text starts with selectedColor and contains " / selectedSize"
          if (text.startsWith(selectedColor) && text.includes(' / ' + selectedSize)) {
            variantSelect.selectedIndex = i;
            matched = true;
            //console.log(`✅ MATCH found: option index ${i} -> value="${variantSelect.value}", text="${text}"`);
            break;
          }
        }

        if (!matched) {
          variantSelect.selectedIndex = -1;
          console.warn(`❌ No variant found for combination: ${selectedColor} / ${selectedSize}`);
          console.warn(`   Expected pattern in option text: starts with "${selectedColor}" and contains " / ${selectedSize}"`);
        } else {
          //console.log(`🎯 Successfully set hidden variant select to: ${variantSelect.value}`);
        }
      }

      // Attach event listeners
      //console.log(`🔗 Attaching change event listeners...`);
      colorSelect.addEventListener('change', () => {
        //console.log(`🟡 Color select changed to: ${colorSelect.value}`);
        syncVariant();
      });
      sizeSelect.addEventListener('change', () => {
        //console.log(`🟡 Size select changed to: ${sizeSelect.value}`);
        syncVariant();
      });

      // Initial sync
      //console.log(`🏁 Running initial sync for form ${idx + 1}...`);
      syncVariant();
    });

    //console.log('✅ All forms processed.');
  }
})();